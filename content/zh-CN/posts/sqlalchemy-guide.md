---
title: SQLAlchemy 使用经验总结
createdAt: 2025-04-11T01:00:05+09:00
updatedAt: 2025-04-11T01:00:05+09:00
tags:
  - ORM
  - 后端
  - SQLAlchemy
---

## 模型定义

这是最新语法下，一个简洁的一对多关系：

存在许多种模型定义方式，其中大部分都是历史遗留，仅推荐下面这种方式：

```python
class Base(DeclarativeBase): ...

class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True) # 主键
    name: Mapped[str] = mapped_column()

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True) # 主键
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id")) #  # 外键，关联公司表
```

存在公司（Company）和员工（Employee）之间的一对多关系。每个公司可以有多个员工，但每个员工只能属于一个公司。

## 准备工作

通过 `create_engine` 可以创建一个数据库引擎，使用 `sessionmaker` 来创建一个会话类。所有的数据库操作都需要通过会话实例来完成。

```python
engine = create_engine(os.getenv("DB_URL"))
Session = sessionmaker(bind=engine)
```

创建符合 SQLAlchemy ORM 的数据库结构：

```python
Base.metadata.create_all(engine)
```

## 增删改查

增删改查操作都可以通过实例化 `Session` 对象来完成。

对于查询操作，可以使用 `session.get` 来根据主键获取单个的对象。

```python
session = Session()
company = session.get(Company, 1) # 根据主键查询获取一个公司对象
```

也可以执行 SQL 语句查询。我们可以链式调用 select 函数来构建查询语句。然后使用 `session.execute` 来执行查询语句。

```python
stmt = select(Company).where(Company.name == "Google") # 等价于 SELECT * FROM companies WHERE name = "Google"
print(stmt) # 可以打印生成的 SQL 语句。
session.execute(stmt) # 执行查询语句，返回所有符合条件的公司
```

返回的结果是一个 Result 结果集，还需要进一步处理来获得数据。

这个结果集可以迭代，并且是一个**元组数组**。每一行对于数据库中的一行数据。每一列对应 select 函数的每个参数。

通过 all() 方法可以获取所有结果：

```python
session.execute(select(Company, Company.name)).all()
# [
#   (<Company id=1>, 'Apple'),
#   (<Company id=2>, 'Google'),
#   (<Company id=3>, 'Preferred Networks'),
# ]
```

这里特意使用了 `select(Company, Company.name)`，可以看到返回的结果是一个元组。第一个元素是 `Company` 对象，第二个元素是 `Company.name` 的值。

这有点不方便，即使我们只查询了 `Company`，返回结果仍然是元组数组：

```python
session.execute(select(Company)).all()
# [
#   (<Company id=1>,),
#   (<Company id=2>,),
#   (<Company id=3>,),
# ]
```

SQLAlchemy 允许我们使用 `scalars()` 方法来获取第一列的结果。其他列会被忽略。

```python
session.execute(select(Company.name, Company.id)).scalars().all() # ['Apple', 'Google', 'Preferred Networks']
```

甚至，有时我们只需要第一列的第一个数据，可以使用 `scalars().first()` 或者 `scalar()` 来获取第一个数据。

```python
session.execute(select(Company.name)).scalars().first() # 'Apple'
session.execute(select(Company.name)).scalar() # 'Apple'
```

scalars 和 scalar 太过于常用，以至于可以直接使用 `session.scalars` 或者 `session.scalar` 进行查询。

```python
session.scalars(select(Company.name)).all() # ['Apple', 'Google', 'Preferred Networks']
session.scalar(select(Company.name)) # 'Apple'
```

除了 `first()`，还有 `one()` 和 `one_or_none()` 等方法获得一行元素，它们的表现不太一样：

| 条件             | `first()`  | `one()`  | `one_or_none()` |
| ---------------- | ---------- | -------- | --------------- |
| 当结果集有多行时 | 返回第一行 | 抛出异常 | 抛出异常        |
| 当结果集为空     | 返回 None  | 抛出异常 | 返回 None       |

---

使用 `session.add` 和 `session.delete` 来进行增删改操作可以满足大部分需求：

```python
session = Session()
company = Company(name="Test Company", id=1)
session.add(company)
session.commit() # 此时，执行了 INSERT 语句，将公司添加到数据库中
company.name = "New Company"
session.commit() # 此时，执行了 UPDATE 语句，将公司的名称修改为 New Company
session.delete(company) # 删除公司
session.commit() # 此时，执行了 DELETE 语句，将公司从数据库中删除
```

这种方式的好处是，他会通过 ORM 对象分析并生成最佳的语句：

```python
session = Session()
alice = Employee(name="Alice", id=1, company_id=1)
session.add(alice)  # 添加 Alice 员工

apple = Company(name="Apple", id=1)
session.add(apple)  # 添加 Apple 公司

bob = Employee(name="Bob", id=2, company=Company(name="Google", id=2))  # 添加 Bob 员工，并直接设定 company 对象
session.add(bob)  # 添加 Bob 员工
session.commit()
```

例如上述代码是完全合法的。SQLAlchemy 能够意识到应该先创建公司，再添加员工，否则会有外键冲突。另外，`bob` 的公司是 `Google`，但是我们并没有创建 `Google` 公司，而是直接使用了 `Company(name="Google", id=2)`。SQLAlchemy 会自动创建 `Google` 公司。同时，在这个提交里只有两个 INSERT 语句，公司和员工的创建分别合并到了一起：

```sql
INSERT INTO companies (id, name) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR)
-- [generated in 0.00015s] [{'id': 1, 'name': 'Apple'}, {'id': 2, 'name': 'Google'}]

INSERT INTO employees (id, name, company_id) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR, %(company_id)s::INTEGER)
-- [generated in 0.00011s] [{'id': 1, 'name': 'Alice', 'company_id': 1}, {'id': 2, 'name': 'Bob', 'company_id': 2}]
```

你也许发现，我们既可以通过 company_id 来指定员工的公司，也可以通过 company 对象来指定员工的公司。很让人在意的是，如果指定了冲突的值会如何呢？

```python
apple = Company(name="Apple", id=1)
session.add(apple)  # 添加 Apple 公司
google = Company(name="Google", id=2)
session.add(google)  # 添加 Google 公司
alice = Employee(name="Alice", id=1, company_id=1, company=google)  # id=1，为 Apple 公司，而 company 指定了 Google， Alice 到底是属于 Apple 还是 Google？
session.add(alice)
session.commit()  # 提交事务
assert alice.company_id == 2
```

经过实验发现，对象的值更为优先。也就是说，如果同时指定了 `company_id` 和 `company`，则 `company` 的值会覆盖 `company_id` 的值。这里不会报任何 warning，让人感觉有点不安。

SQLAlchemy 虽然比较智能，但由于交给 SQLAlchemy 处理不一定可靠，行为难以捉摸。如果想要完全控制，另一个方式是使用 `session.execute` 来执行 SQL 语句。

```python
session = Session()
session.execute(insert(Company).values(id=1, name="Test Company")) # 执行 INSERT 语句，将公司添加到数据库中
```

你可能会见到另一套使用方式，使用 session.query 来进行查询。注意这是过时的用法，不要混用。

## 关于 ORM 对象

SQAlchemy 背后存在许多魔法。例如同一个 session 中，相同的对象在内存中只会存在一份。并且各种修改操作也能作用到查询出来的对象上。

```python
company = Company(name="Test Company", id=1)

session.add(company)
session.commit()

company_1 = session.get(Company, 1)
assert company_1 is company  # True，查询出的对象和之前添加的对象是同一个对象

session.execute(update(Company).where(Company.id == 1).values(name="New Company")) # 修改了公司的名称
session.commit()

assert company.name == "New Company"  # 神奇地，之前存在的对象的值也被修改了
```

了解了这些的话，我们可能可以少写许多非必要的重复查询。

## 关于关系

如果需要关联查询，可以使用 `relationship` 来定义关系。
例如，如果我们想要查询一个公司的所有员工，可以在 `Company` 类中定义一个 `employees` 属性，使用 `relationship` 来关联 `Employee` 表格。

``` python
class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    employees: Mapped[List["Employee"]] = relationship() # 关联查询
```

另一种情况，如果我们想要查询一个员工所属的公司，可以在 `Employee` 类中定义一个 `company` 属性，使用 `relationship` 来关联 `Company` 表格。

``` python
class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    company: Mapped["Company"] = relationship() # 关联查询
```

如果双方都可能进行关联查询，可以在 `Company` 和 `Employee` 类中都定义一个 `relationship` 属性。

注意，在这种情况下，需要至少在一个类中定义 `back_populates` 属性，以便 SQLAlchemy 知道如何在两个类之间建立关系。`back_populates` 属性的值是另一个类中定义的 `relationship` 属性的名称。

``` python
class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    employees: Mapped[list["Employee"]] = relationship()  # 关联查询

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    company: Mapped["Company"] = relationship(back_populates="employees")  # 关联查询，同时定义了反向关系
```

## 关于延迟加载

`relationship` 存在一个重要的参数 `lazy`，用于指定加载方式。

`lazy` 默认值为 `select`。意思是“在访问这个字段时通过 `select` 查询延迟加载字段的值”。即，默认会进行延迟加载（Lazy Loading）。

```python
class Company(Base):
    # 省略其他代码
    employees: Mapped[List["Employee"]] = relationship() # 默认 lazy="select"，会延迟加载

session = Session()
employees = session.scalars(select(Employee)).all()
for employee in employees:
    logger.info("Employee: %s, Company: %s", employee.name, employee.company.name)
```

如果数据库里存在 3 个公司，每个公司 3 名员工，可能会产生如下的输出：

```sql
BEGIN (implicit)

# 查询所有员工
SELECT employees.id, employees.name, employees.company_id
FROM employees
-- [generated in 0.00012s] {}

# 查询 id 为 1 的公司
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [generated in 0.00013s] {'pk_1': 1}

-- Employee: Brian Baker, Company: Brown-Spencer
-- Employee: Karen Payne, Company: Brown-Spencer
-- Employee: Stephanie Bradley, Company: Brown-Spencer

# 查询 id 为 2 的公司
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [cached since 0.002736s ago] {'pk_1': 2}

-- Employee: Joseph Howard, Company: Cooper, Hunt and Long
-- Employee: Amanda Brooks, Company: Cooper, Hunt and Long
-- Employee: Lindsay Grant, Company: Cooper, Hunt and Long

# 查询 id 为 3 的公司
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [cached since 0.00426s ago] {'pk_1': 3}

-- Employee: Cynthia Pittman, Company: Pope Ltd
-- Employee: Amanda Cook, Company: Pope Ltd
-- Employee: James Fernandez, Company: Pope Ltd
```

可以发现首先查询了所有员工，然后在访问每个员工的公司时，才会查询公司表。
这就是延迟加载（Lazy Loading）。

由于我们查询员工时很可能并不需要公司信息，所以延迟加载是有意义的。

但这会导致 N+1 查询问题。我们需要进行 1 次查询获取所有 9 名员工，然后对每个员工进行查询获取公司信息。查询数很多，会大大拖慢查询速度。

这里有一个细节：实际上并不是 9+1=10 次查询，而是 3+1=4 次。原因在于 sqlalchemy 缓存了查询的结果，如果我们访问同一公司的信息，sqlalchemy 会直接从缓存中获取，而不会再次查询数据库。因此，虽然我们访问了 9 次员工的公司信息，但它们实际上分属于 3 个公司，因此实际上只多查询了 3 次数据库。

无论如何，如果我们确实需要访问员工的公司信息，延迟加载会大量增加查询次数。
这里非常反直觉。在 relationship 中使用 `lazy` 参数反而可以指定预先加载（Eager Loading）。

下面介绍几种预先加载的模式，它们的查询的性能会有微妙的差异，但一般来说，`selectin` 的性能会更好。

### 使用 joined 预加载

如果 lazy 设置为 `joined`，在查询 Employee 时，会使用 JOIN 语句将 Company 表连接到 Employee 表。

```python
class Employee(Base):
    company: Mapped["Company"] = relationship(lazy="joined")  # 预加载，使用 JOIN 语句
```

生成的 SQL：

```sql
BEGIN (implicit)
SELECT employees.id, employees.name, employees.company_id, companies_1.id AS id_1, companies_1.name AS name_1
FROM employees LEFT OUTER JOIN companies AS companies_1 ON companies_1.id = employees.company_id
-- [generated in 0.00012s] {}
```

### 使用 selectin 预加载

如果 lazy 设置为 `selectin`，在查询 Employee 时，会使用 JOIN 语句将 Company 表连接到 Employee 表。

```python
class Employee(Base):
    company: Mapped["Company"] = relationship(lazy="selectin")  # 预加载，使用 SELECT IN 语句
```

生成的 SQL：

```sql
BEGIN (implicit)
SELECT employees.id, employees.name, employees.company_id
FROM employees
-- [generated in 0.00012s] {}

SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id IN (%(primary_keys_1)s::INTEGER, %(primary_keys_2)s::INTEGER, %(primary_keys_3)s::INTEGER)
-- [generated in 0.00016s] {'primary_keys_1': 1, 'primary_keys_2': 2, 'primary_keys_3': 3}
```

### 使用 subquery 预加载

subquery 预加载也需要进行两次查询。

```python
class Employee(Base):
    company: Mapped["Company"] = relationship(lazy="subquery")  # 预加载，使用子查询
```

生成的 SQL：

```sql
BEGIN (implicit)
SELECT employees.id, employees.name, employees.company_id
FROM employees
-- [generated in 0.00017s] {}

SELECT companies.id AS companies_id, companies.name AS companies_name, anon_1.employees_company_id AS anon_1_employees_company_id
FROM (SELECT DISTINCT employees.company_id AS employees_company_id
FROM employees) AS anon_1 JOIN companies ON companies.id = anon_1.employees_company_id
-- [generated in 0.00039s] {}
```

### 查询时决定如何加载

我们也可以在查询时决定如何加载。

```python
stmt = select(Employee).options(selectinload(Employee.company)) # 在查询时，对于 Employee 表的 company 字段使用 selectin 预加载
```

## 事务管理

一个查询可能有以下几种状态：

1. 未提交（pending）：事务还没有提交，数据还没有写入数据库。
2. 已提交更改（flushed）：数据已经写入数据库，但事务还没有提交。此时只有当前 session 可以看到更改。
3. 已提交事务（committed）：数据已经写入数据库，事务已经提交。此时所有 session 都可以看到更改。

### flush

我们可以使用 `session.flush()` 来将更改提交到数据库，但不会提交事务。这意味着在当前 session 中可以看到更改，但在其他 session 中看不到。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush() # 将更改提交到数据库，但不会提交事务

assert session.get(Company, 1).id == 1  # 可以查询到刚刚添加的公司

new_session = Session()
assert new_session.get(Company, 1) is None  # 在别的 session 还查询不到，因为事务没有提交
```

### commit

通过 `session.commit()` 可以提交事务。意味着修改真正生效。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.commit() # 提交事务

new_session = Session()
assert new_session.get(Company, 1).id == 1  # 在别的 session 可以查询到，因为事务已经提交
```

### rollback

可以通过 `session.rollback()` 来回滚一个还未提交的事务。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush()  # 将更改提交到数据库，但不会提交事务
assert session.get(Company, 1).id == 1  # 此时能查询到
session.rollback()  # 回滚事务，撤销更改
assert session.get(Company, 1) is None  # 此时查询不到
```

作为一个错误的例子，如果事务已经使用 commit 提交，那么是无法回滚的：

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.commit()  # 提交事务
assert session.get(Company, 1).id == 1  # 此时能查询到
session.rollback()  # 回滚事务，撤销更改
assert session.get(Company, 1).id == 1  # 此时仍然能查询到，因为事务已经提交，无法回滚
```

### flush，commit 和 rollback 的联合使用

我们经常需要保证多次数据库修改的原子性。也就是要么全部成功，要么全部失败。
如果失败则需要回滚。

```python
session = Session()
try:
    session.add(Company(name="Test Company", id=1))
    session.flush() # 将更改提交到数据库，但不会提交事务
    raise Exception("Test exception") # 模拟异常
    session.commit() # 提交事务
except Exception:
    session.rollback() # 回滚事务，撤销所有更改
```

### 使用 begin 管理

实践中，我们最好不要手动 `commit` 或者 `rollback`，而是使用 `session.begin()` 来管理事务。

```python
session = Session()
with session.begin():
    session.add(Company(name="Test Company", id=1)) # 添加公司

# 出了 with 语句，事务会自动提交，此外，如果发生异常，事务会自动回滚
new_session = Session()
assert new_session.get(Company, 1) is not None  # 在别的 session 可以查询到，因为事务已经提交
```

可以使用 `session.begin_nested()` 来创建一个嵌套事务。

```python
    with session.begin():
        session.add(Company(name="Test Company", id=1))
        with session.begin_nested():
            session.add(Employee(name="Test Employee", id=1, company_id=1))
            session.add(Employee(name="Test Employee 2", id=2, company_id=1))
```

### auto flush

默认情况下，SQLAlchemy 的 auto flush 功能是开启的。但这并不意味着每次 session.add 等操作都会 flush。实际上，开启此选项是在查询前自动 flush。

```python
session = sessionmaker(bind=engine)(autoflush=True) # 默认就是开启的，这里显式开启，可以省略
company = Company(name="Google", id=1)
session.add(company)
assert session.get(Company, 1) is not None # 并没有提交更改，也没有提交事务，但是能查询到，因为在查询前进行了自动 flush
```

而如果关闭：

```python
session = sessionmaker(bind=engine, autoflush=False)() # 关闭自动 flush
company = Company(name="Google", id=1)
session.add(company)
assert session.get(Company, 1) is None # None，因为没有自动 flush
```

需要注意的是，`session.flush()` 只与 `session.add()` 或者 `session.delete()`配合使用。它只影响通过 `session.add()` 方法添加，或者 `session.delete()` 方法删除的对象。

换言之，如果我们直接使用 `session.execute` 来执行 SQL 语句，则不会受到 `autoflush` 的影响。

``` python
session = sessionmaker(bind=engine, autoflush=False)()
session.execute(insert(Company).values(id=1, name="Google")) # execute 不需要 flush，会自动提交查询
assert session.get(Company, 1) is not None # 如果使用 execute 进行插入，即使没有自动 flush，仍然能查询到
```

### expire on commit

SQLAlchemy 的 expire on commit 功能是开启的。也就是说，在提交事务后，所有对象都会被标记为过期。这个特性在只在非常微妙的场景下有用：

如下面代码所示，如果提交后，有另一个 session 修改了对象的值，如果 expire on commit 功能关闭，会访问到过期的值。

```python
Session = sessionmaker(bind=engine, expire_on_commit=False)
session = Session()
c = Company(name="Google", id=1)
session.add(c)
session.commit()

# 在另一个 session 中修改了公司的名称
other_session = Session()
other_session.execute(update(Company).where(Company.id == 1).values(name="Meta"))
other_session.commit()

assert c.name == 'Google' # 仍然是 Google，因为没有过期
```

有意思的是，如果在同一个 session 中，修改了对象的值，则不会有这个问题。SQLAlchemy 魔法般地在幕后能够意识到对象 `c` 被修改，并设置了新的值。

```python
Session = sessionmaker(bind=engine) # expire_on_commit=True
session = Session()
with session.begin():
    c = Company(name="Google", id=1)
    session.add(c)

with session.begin():
    session.execute(update(Company).where(Company.id == 1).values(name="Meta"))
assert c.name == "Meta"
```

我个人的感触是，没有任何理由需要开启 expire on commit 功能。在 Commit 后，我真的需要在意一个值会不会被别的 session 修改吗？这本身是无法保证的。即使我及时刷新了数据，在查询出数据后的任何时候——比如数据传输过程中，数据也可能会被修改从而过期。况且大多数情况下，变更不会发生，这只会增加复杂性，并减慢查询速度。

## 异步

SQLAlchemy 支持异步操作。我们只需要构建一个异步的引擎和会话。

```python
async_engine = create_async_engine(os.getenv("DB_URL"))
AsyncSession = async_sessionmaker(bind=async_engine)
```

但是异步的世界和同步完全不同。

最大的区别在于，异步世界没有隐式 I/O。我们需要显式地使用 `await` 来进行 I/O 操作。

何时执行 I/O 在 SQLAlchemy 中并不是很显而易见。

```python
session = AsyncSession()
async with session.begin():
    session.add(Company(name="Google", id=1)) # 此时没有 I/O 操作，只是将对象添加到 session 中
    await session.commit() # 此时有 I/O 操作，提交事务
    company = await session.get(Company, 1) # 查询 id 为 1 的公司，此时有 I/O 操作
    select_stmt = select(Company).where(Company.name == "Google") # 此时没有 I/O 操作，只是生成了 SQL 语句
    result = await session.execute(select_stmt) # 此时有 I/O 操作，执行查询语句
    companies = result.scalars().all() # 此时没有 I/O 操作，只是处理了查询结果
```

我们可以看到，`session.commit()` 和 `session.execute()` 都是 I/O 操作。我们需要使用 `await` 来等待它们完成。而 `session.add()` 和 `select()` 都不是 I/O 操作。它们只是将对象添加到 session 中，或者生成 SQL 语句。

延迟加载在异步环境下难以使用。假如 `Company` 和 `Employee` 之间的关系是延迟加载的，也就是使用默认的 `lazy="select"`。下面（同步）的代码则会进行两次查询：

```python
with Session() as session:
    b = session.get(Employee, 1) # 查询 id 为 1 的员工
    print(b.company.name) # 延迟查询员工的公司名称
```

除了性能有点差之外，没有问题，完全能正常工作。

而在异步下，这段代码会报错：

```python
async with AsyncSession() as session, session.begin():
    a = await session.get(Employee, 1)
    logger.info(a.company.name) # sqlalchemy.exc.MissingGreenlet
```

其实报错是可以理解的。因为异步下，一切 I/O 操作都需要显式 await，然而在这里，访问 `a.company` 时，sqlalchemy 需要进行 I/O 操作，但没有 await。

实际上，报错也不一定是坏事。我认为我们应该尽可能地杜绝隐式 I/O。如果我能预见在 Session 中会用到懒加载的字段，我就应该提前加载它，否则会影响性能。

---

如果我们真的需要懒加载，我们可以使用 `AsyncAttrs`，这需要我们修改基类：

```python
class Base(AsyncAttrs, DeclarativeBase):
    pass
```

然后可以通过如下方式 await 字段：

```python
name = await a.awaitable_attrs.company.name
```

个人觉得上述方式非常别扭。也可以使用 `session.run_sync`：

```python
name = await session.run_sync(lambda _: a.company.name)
```

上述方式不需要修改基类。这种方式实际上会启动一个新的线程去执行查询。

## 关于 Model -> DTO

SQLAlchemy 的 ORM 对象被称为 Model，当我们要将其通过 API 返回时，通常需要将其转换为 DTO（Data Transfer Object）。在 FastAPI 中，我们可以使用 Pydantic 来定义 DTO。

最新的 pydantic 2.x 版本中，我们可以使用 `ConfigDict` 来定义一个可以接受 SQLAlchemy ORM 对象的 DTO。

```python
from pydantic import BaseModel, ConfigDict

class DTOBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
```

这里的 `from_attributes=True` 表示可以从 SQLAlchemy ORM 对象中获取属性。

注意 LLM 可能会生成过时的用法，例如:

```python
class SomeDTO(BaseModel):
    class Config:
        orm_mode = True
```

不要使用这种方式，它是 pydantic 1.x 的历史遗留。

---

然后可以定义 DTO 类：

```python
class EmployeeCompany(DTOBase):
    id: int
    name: str

class CompanyEmployee(DTOBase):
    id: int
    name: str

class EmployeePublic(DTOBase):
    id: int
    name: str
    company: EmployeeCompany

class CompanyPublic(DTOBase):
    id: int
    name: str
    employees: list[CompanyEmployee]
```

在这里可以只填需要的字段，并注意防止循环引用。

使用 `employee_public = EmployeePublic.model_validate(employee)` 来将 SQLAlchemy ORM 对象转换为 DTO 对象。

## 或许是最佳实践

### 不要使用默认的懒加载

默认的懒加载策略几乎没有存在价值。

首先，由于异步的并发性能较高，我们会首选异步下进行开发。此时我们必须要显式声明 await，这表示我们仍需要明确知道哪里会进行 I/O 操作，完全没有减轻开发时的心智负担，反而必须要在运行时才会收到报错。

另外，是否需要用到懒加载的字段在大多数时候时是可预见的。而且要么我们对懒加载的字段完全不感兴趣，要么会对每一行的懒加载字段都感兴趣。在前者的情况下，懒加载毫无意义；在后者的情况下，懒加载会导致 N+1 查询问题。只有在我们对个别记录的懒加载字段感兴趣时，懒加载才有意义，但这种情况几乎不会发生。

因此，在所有的 `relationship` 中都使用 `lazy="selectin"` 来进行预加载可能是一种最佳实践。

### 关掉 `expire_on_commit`

`expire_on_commit` 似乎也没有存在的价值，它默认开启，平添了许多 I/O 操作，并且在异步下往往会因此报错，更糟糕的是，它几乎什么问题都没有解决。

例如下面这段代码，假设我开启了 `expire_on_commit`，并且没有在表定义种使用 `lazy="selectin"`，而是查询中指定 `options`,此时在 `commit` 事务后，`e` 会过期。也许机智的我知道 `session.refresh(e)` 会刷新对象 `e` 的值。然而，其实这里即使 `refresh` 也不会重新加载 `company` 的值，只能重新写一遍查询语句才行...

总之，不仅增加了 I/O 操作，还会让代码看上去很奇怪。

```python
async def main():
    async with AsyncSession() as session:
        e = await session.scalar(select(Employee).where(Employee.name == "John Doe").options(selectinload(Employee.company)))
        logger.info(f"Employee: {e.company.name}")
        await session.commit()
        await session.refresh(e)
        logger.info(f"Employee: {e.company.name}") # error
```

### 每个 session 只在最后 commit 一次

从前面的分析我们可以看到，`commit` 之后再进行别的操作，会有各种各样的问题。实际上，每个 `session` 只 `commit` 一次则是非常好的实践。可以避免上述的一系列问题，同时保证原子性。

特别是 web 应用中，`session` 的生命周期和请求的生命周期一致的话，管理起来容易许多。

因此，比起手动 `commit`，使用 `session.begin()` 来管理事务是更好的选择。我们可以把 session 的创建和 begin 放在一起，同时代码中也不再需要 `session.commit()`, `session.rollback()` 等操作，还不用 `try...catch` 语句，更加简洁。

```python
# 异步
async with AsyncSession() as session, session.begin():
    ...

# 同步
with Session() as session, session.begin():
    ...
```

## 总结

我分享了许多 SQLAlchemy 的使用技巧和我认为的最佳实践。主要聚集于 ORM 相关的关联模型定义、延迟加载、事务、异步等方面。

其中也许有一些认知错误，欢迎大家一起讨论。我没有介绍 SQLAlchemy 的所有功能，例如索引、别名、Alembic 迁移等等，因为那些功能并不容易出错。其实上述讲的许多，在 SQLAlchemy 的文档中都有介绍，只是文档内容实在过多，而且新旧 API 混杂，实在难以消化。

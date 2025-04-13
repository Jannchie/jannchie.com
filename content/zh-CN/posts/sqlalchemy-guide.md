---
title: SQLAlchemy 使用经验总结
createdAt: 2025-04-11T01:00:05+09:00
updatedAt: 2025-04-11T01:00:05+09:00
tags:
  - ORM
  - 后端
  - SQLAlchemy
---

这是一个最新语法下，一个简洁的一对多关系：

## 模型定义

存在许多种模型定义方式，其中大部分都是历史遗留，仅推荐下面这种 SQLAlchemy 2.0 的方式：

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

上述代码定义了公司（Company）和员工（Employee）之间的一对多关系。每个公司可以有多个员工，但每个员工只能属于一个公司。

### 定义关系

可以使用 `relationship` 来定义关系，从而实现关联查询。

例如，如果我们想要查询公司时能够查出所有员工，可以在 `Company` 类中定义一个 `employees` 属性，使用 `relationship` 来关联 `Employee` 表格。

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

注意，在这种情况下，需要**至少在一个**类中定义 `back_populates` 属性，以便 SQLAlchemy 知道如何在两个类之间建立关系。`back_populates` 属性的值是另一个类中定义的 `relationship` 属性的名称。

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

### 默认值

`mapped_column` 支持 `server_default`、`default` 和 `default_factory`参数。

`server_default` 中的 server 指数据库。它会在创建表时指定字段默认值。

通常，使用 `server_default` 更好。一个显而易见的好处是，每次创建对象时，使用 `default` 每次都会在 SQL 语句显式指定，更为冗长。

需要注意的是，`server_default` 的值不能是数字类型。即使是数字类型的字段也需要使用字符串类型的值，如下所示：

``` python
class TestTable(Base):
    __tablename__ = "test_table"
    default_field: Mapped[int] = mapped_column(server_default="0") # 数据库端默认值
```

但是使用 `default` 也并非一无是处。如果不指定 `default`，在对象创建而未提交时访问该字段会返回 `None`。如果这一点对你很重要（通常不会），那么可以使用 `default` 来指定默认值。

当默认值是一个引用类型时，使用 `default_factory` 更好，否则会陷入所有对象共享同一个引用的常见陷阱。

```python
class Test(Base):
    __tablename__ = "test"
    default_field: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])  # 错误使用 default

session = Session()

t1 = Test() 
t1.default_field.append("test") 
print(t1.default_field)  # ['test']

t2 = Test()
print(t2.default_field)  # ['test']，t1 和 t2 共享同一个引用
```

### 时区陷阱

这里和 SQLAlchemy 没有直接关系，但还是值得一讲。

时区的处理很容易出错。一个最简洁的时间字段定义可能是这样的，我们希望创建时记录时间，我们通过 `func.now()` 获取服务器当前时间：

```python
created_at: Mapped[datetime] = mapped_column(default=func.now())
```

然而，这很可能和你的预期不一致。我们以 Postgres 为例，实际上，这里声明的数据库字段默认是 `TIMESTAMP` 类型。这是一个不带时区信息的时间类型。

我一直有一个误解，认为 `TIMESTAMP` 是以格林威治时间为准的，然而那是“Unix 时间戳”的定义。Postgres 的 `TIMESTAMP` 是一个不带时区信息的时间戳。如果服务器位于日本，那么它会存储日本时间 1970 年 1 月 1 日 00:00:00 到当前时间的时间间隔。对于绝大多数人而言，这都不是想要的结果，这不是 Unix 时间戳。

Postgres 提供了 `TIMESTAMP WITH TIME ZONE` 类型，它会存储 Unix 时间戳。如果要采用 `TIMESTAMP WITH TIME ZONE`， SQLAlchemy 中可以这样定义字段：

```python
created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.now())
```

它们差异在于，虽然都返回 datetime，但是前者的 tzinfo 是 `None`，后者的 tzinfo 是 UTC。当返回给前端时， datetime 对象往往会被转换为 ISO 8601 格式的字符串。

``` json
{
  "with_tz": "2025-04-12T18:32:18.420971Z", // 明确表示是 UTC 时间。
  "without_tz": "2025-04-12T18:32:18.420971" // 直接解析就是错误的时间，但是，如果强行把它当成 UTC 时间，勉强可以推测出正确的本地时间。
}
```

可以发现，区别在于 `with_tz` 的时间后面有一个 `Z`，表示 UTC 时间。如果在前端通过 `new Date("2025-04-12T18:32:18.420971Z")` 来解析这个时间，可以发现这个时间会正确转换成本地时间。而 `without_tz` 则将这个时间当成本地时间来解析，除非人在 UTC+0 时区，或者前端手动指定时区，否则会解析出错误的结果。

几乎没有不需要时区的场景，还是积极显式指明 `TIMESTAMP(timezone=True)` 吧。

我们一般不推荐使用应用服务器时间，而是使用数据库时间。因为数据库应用服务器可能在世界各地，而数据库集群相对比较中心化。但也许有人会这么写：

```python
default_datetime_now_tz: Mapped[datetime.datetime] = mapped_column(
    TIMESTAMP(timezone=True),
    default_factory=datetime.datetime.now,
)
```

这又是另外一种错误。`datetime.datetime.now()` 返回的是应用服务器本地时间，并且没有指明服务器位于哪个时区。因此数据库会将这个时间当作 UTC 时间，这往往是错误的。

实际上，在任何时候都不应使用无参数的 `datetime.now()`。它会返回一个没有时区信息的时间戳，它几乎不会是我们所期望的。如果开启了 Ruff(DTZ005) 会提醒我们加上时区信息。

如果一定要使用 `datetime.now` 获取当前时间，应当指明时区：

```python
default_datetime_utcnow_tz: Mapped[datetime.datetime] = mapped_column(
    TIMESTAMP(timezone=True),
    default_factory=lambda: datetime.datetime.now(datetime.UTC),
)
```

总结来说，我们我们应该使用 `TIMESTAMP WITH TIME ZONE` 类型的字段，并且在创建时使用 `func.now()` 来获取当前时间。如果真的有特殊情况，需要使用应用服务器时间，也一定要带上时区信息。

### Model 映射为 dataclass

Python 标准库中的 `dataclass` 是一个非常方便的工具，可以用来定义简单数据类。我们可以使用 `dataclass` 来定义 SQLAlchemy 的 ORM 对象。

`dataclass` 在构造对象时很有用。具体来说，如果不使用 `dataclass`，默认的构造函数声明是 `(**kw: Any) -> Employee`。使用者很难判断有哪些值需要初始化，哪些又有默认值，哪些又不可以设置。

例如我们通常希望 `update_at`、`create_at`、`id` 等字段由数据库自动生成，而不是由使用者设置。

而 `dataclass` 则会自动根据我们的定义生成 `__init__` 方法。从而知道哪些值可以设置。

继承 `MappedAsDataclass` 类可以将 SQLAlchemy 的 ORM 对象映射为 dataclass。我们一般会在基类中操作：

```python
class Base(DeclarativeBase, MappedAsDataclass): ...
```

此时，在 `mapped_column` 和 `relationship` 中可以就可以使用 `dataclass` 的参数了。常用的是`init`,用于指定一个字段是否能出现在构造函数中。`dataclass` 还支持 `default` 和 `default_factory`，用于指定默认值，这两个参数原先只能在 `mapped_column` 中使用，现在也能在 `relationship` 中使用。

这会稍微改变原先类的行为。比较明显的变化是，不再能随便指定 field 的顺序了，现在如果一个字段需要出现在构造函数里（没有设置 `init=False`），那么没有默认值的字段必须在有默认值的字段前面，和构造函数参数的顺序相同。

这里还有一些陷阱。我们会发现一个字段可能有三种情况：

1. 没有设置默认值。在这种情况下，构造函数一定要提供这个参数。
2. 有设置默认值。在这种情况下，构造函数可以不提供这个参数。
3. `init` 为 `False`。在这种情况下，构造函数不能提供这个参数。

在 `Employee` 的类中，原先 `company_id` 和 `company` 的都是可选的。如果使用 `dataclass` 行为最接近的应该是 2。也就是 `company_id` 和 `company` 都有默认值。Python 没有 `undefined` 这种东西，所以我们只能将默认值设置为 `None`。

于是可以发现，如果还想通过 company_id 来设置员工的公司的话，我们写成 `Employee(company_id=1)`。而这并不会正常工作，因为 `company` 的默认值也是 `None`。因此我们的构造等价于 `Employee(company_id=1, company=None)`，提供 `None` 和不提供其实并不一样。同时前面我们讨论过，relationship 的值会覆盖外键的设置。我们实际上创建了一个没有公司的员工。

这里，原先的行为会被改变，因此很让人困惑。我所认为的最佳实践是，如果外键字段和关联查询用的 `relationship` 字段同时出现，则将 `relationship` 设为 `init=False`。这样它就不会在构造函数中出现了，也不会有刚才提及的问题。

### 抽象出字段

前面提到，许多表需要记录条目的 id、创建时间和更新时间。我们可以将它们抽象出来：

```python
class BaseWithAudit(Base):
    __abstract__ = True
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), init=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), init=False) 
```

这里的 `__abstract__` 属性表示这个类不会被创建为表。`id`、`created_at` 和 `updated_at` 字段会被所有继承这个类的表格所共享。

这里使用了自增主键，如果我们不希望暴露用户规模，使用 uuid 作为主键或许更好。

### 其他配置

其他还有索引、唯一性约束等配置，但是这些不太容易出错，篇幅有限这里略过，可以直接阅读文档。

## 准备工作

经过上述一系列介绍，我们终于正确定义了模型。在进行查询之前，我们需要进行一些准备工作。

通过 `create_engine` 可以创建一个数据库引擎，使用 `sessionmaker` 来创建一个会话类。所有的数据库操作都需要通过会话实例来完成。

```python
engine = create_engine(os.getenv("DB_URL"))
Session = sessionmaker(bind=engine)
```

创建符合 SQLAlchemy ORM 的数据库结构：

```python
Base.metadata.create_all(engine)
```

## 查询

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

返回的结果是一个结果集，还需要进一步处理来获得数据。

这个结果集可以迭代，内部数据是一个**元组数组**。每一行对于数据库中的一行数据。每一列对应 select 函数的每个参数。

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

甚至，有时我们只需要第一行第一列数据，可以使用 `scalar()` 来获取它。

```python
session.execute(select(Company.name)).scalar() # 'Apple'
```

scalars 和 scalar 太过于常用，以至于可以直接使用 `session.scalars` 或者 `session.scalar` 进行查询。

```python
session.scalars(select(Company.name)).all() # 等价于 session.execute(select(Company.name)).scalars().all()
session.scalar(select(Company.name)) # 等价于 session.execute(select(Company.name)).scalar()
```

除了 `all()` 获取所有元素之外，比较常用的是使用 `first()`、 `one()` 或者 `one_or_none()` 等方法获得一行元素，它们的表现不太一样：

| 条件             | `first()`  | `one()`  | `one_or_none()` |
| ---------------- | ---------- | -------- | --------------- |
| 当结果集有多行时 | 返回第一行 | 抛出异常 | 抛出异常        |
| 当结果集为空     | 返回 None  | 抛出异常 | 返回 None       |

### 增删改

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

这种方式的好处是，他会通过 ORM 对象分析并生成较佳的语句：

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

例如上述代码是完全合法的。SQLAlchemy 能够意识到应该先创建公司，再添加员工，否则会有外键冲突。另外，`bob` 的公司是 `Google`，但是我们并没有创建 `Google` 公司，而是直接使用了 `Company(name="Google", id=2)`。SQLAlchemy 会自动创建 `Google` 公司。

同时，值得一提的是，在这个提交里实际只执行两条 `INSERT` 语句，公司和员工的创建分别合并到了一起，形成更高效的插入逻辑：

```sql
INSERT INTO companies (id, name) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR)
-- [generated in 0.00015s] [{'id': 1, 'name': 'Apple'}, {'id': 2, 'name': 'Google'}]

INSERT INTO employees (id, name, company_id) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR, %(company_id)s::INTEGER)
-- [generated in 0.00011s] [{'id': 1, 'name': 'Alice', 'company_id': 1}, {'id': 2, 'name': 'Bob', 'company_id': 2}]
```

### 用外键字段设置，还是用关系字段设置？

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

我认为的最佳实践是，不要直接设置 relationship 的值，而是通过外键列来设置关系。也就是使用 `company_id` 来设置员工的公司。毕竟如果获得对象有一定的成本，可能需要进行查询，而如果已经获得了对象的话，也能简单访问其主键用于进行关系设置。

### 使用 SQL 语句查询

如果想要完全控制，另一个方式是使用 `session.execute` 来执行 SQL 语句。

```python
session = Session()
session.execute(insert(Company).values(id=1, name="Test Company")) # 执行 INSERT 语句，将公司添加到数据库中
```

你可能会见到另一套使用方式，使用 `session.query` 来进行查询。注意这是过时的用法，最好不要使用。

## ORM 对象是统一的

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

这样神奇的行为虽然方便，但可能有时会让人困惑。

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

这里有一个细节：实际上并不是 9+1=10 次查询，而是 3+1=4 次。原因在于一个 session 内部，sqlalchemy 能够缓存查询的结果，如果我们访问同一公司的信息，sqlalchemy 会直接从缓存中获取，而不会再次查询数据库。因此，虽然我们访问了 9 次员工的公司信息，但它们实际上分属于 3 个公司，因此实际上只多查询了 3 次数据库。

无论如何，如果我们确实需要访问员工的公司信息，延迟加载会大量增加查询次数。
在 relationship 中使用 `lazy` 参数反而可以指定预先加载（Eager Loading）。

这里非常反直觉，不写 `lazy` 参数就会使用懒加载，而写了 `lazy` 反而不懒加载了。

下面介绍几种预先加载的模式，它们的查询的性能会有微妙的差异，但一般来说，`selectin` 的性能会更好。

### 使用 joined 预加载

如果 lazy 设置为 `joined`，在查询 Employee 时，会使用 JOIN 语句将 Company 表连接到 Employee 表。

```sql
BEGIN (implicit)
SELECT employees.id, employees.name, employees.company_id, companies_1.id AS id_1, companies_1.name AS name_1
FROM employees LEFT OUTER JOIN companies AS companies_1 ON companies_1.id = employees.company_id
-- [generated in 0.00012s] {}
```

### 使用 selectin 预加载

如果 lazy 设置为 `selectin`，在查询 Employee 时，触发第二个查询，通过 IN 语句筛选出所有员工的公司。

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

作为一个错误的示范，如果事务已经使用 commit 提交，那么是无法回滚的：

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.commit()  # 提交事务
assert session.get(Company, 1).id == 1  # 此时能查询到
session.rollback()  # 回滚事务，撤销更改
assert session.get(Company, 1).id == 1  # 此时仍然能查询到，因为事务已经提交，无法回滚
```

另外，如果一个 session 没有 commit 就关闭了，那么这个 session 中的所有更改都会被回滚。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush()  # 将更改提交到数据库，但不会提交事务
session.close()  # 关闭 session，此时会回滚事务，撤销所有更改
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

### autoflush

默认情况下，SQLAlchemy 的 auto flush 功能是开启的。但这并不意味着每次 session.add 等操作都会 flush。实际上，开启此选项是在查询前自动 flush。

```python
session = sessionmaker(bind=engine)(autoflush=True) # 默认就是开启的，这里显式开启，可以省略
company = Company(name="Google", id=1)
session.add(company)
assert session.get(Company, 1) is not None # 并没有提交更改，也没有提交事务，但是能查询到，因为在查询前进行了自动 flush
```

如果关闭 autoflush 呢？

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

`autoflush` 感觉是一个不太有用的功能，反而容易让人感到困惑，也许应该关闭。

### expire_on_commit

SQLAlchemy 的 `expire_on_commit` 功能是默认开启的。也就是说，在提交事务后，所有对象都会被标记为过期。这个特性在只在非常微妙的场景下有用：

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

我个人的感想是，没有任何理由需要开启 `expire_on_commit` 功能。在 Commit 后，我真的需要在意一个值会不会被别的 `session` 修改吗？这本身是无法保证的。即使我及时刷新了数据，在查询出数据后的任何时候——比如数据传输过程中，数据也可能会被修改从而过期。况且大多数情况下，变更不会发生，这只会增加复杂性，并减慢查询速度。

另外，许多关于 SQLAlchemy 的说明中，都将 `expire_on_commit` 设置为 `False`。（例如 [Litestar](https://docs.litestar.dev/2/tutorials/sqlalchemy/0-introduction.html)和 [官方文档](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)）

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
    session.add(Company(name="Google", id=1))
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

### 异步懒加载

如果我们真的需要懒加载并访问数据（往往不需要），我们可以使用 `AsyncAttrs`，这需要我们修改基类：

```python
class Base(AsyncAttrs, DeclarativeBase):
    pass
```

然后可以通过如下方式 `await` 字段：

```python
name = await a.awaitable_attrs.company.name
```

个人觉得上述方式非常别扭。也可以使用 `session.run_sync`：

```python
name = await session.run_sync(lambda _: a.company.name)
```

上述方式不需要修改基类。这种方式实际上会启动一个新的线程去执行查询。它们几乎是相同的。

## 或许应该这么写

在使用 SQLAlchemy 的过程中，特别是异步开发，非常令我痛苦，代码会在各种意想不到的地方报错。为了杜绝这些错误，我认为也许应该这么写：

### 不要使用默认的懒加载

默认的懒加载策略几乎没有存在价值。

首先，由于异步的并发性能较高，我们会首选异步下进行开发。此时我们必须要显式声明 await，这表示我们仍需要明确知道哪里会进行 I/O 操作，完全没有减轻开发时的心智负担，反而必须要在运行时才会收到报错。

另外，是否需要用到懒加载的字段在大多数时候时是可预见的。而且要么我们对懒加载的字段完全不感兴趣，要么会对每一行的懒加载字段都感兴趣。在前者的情况下，懒加载毫无意义；在后者的情况下，懒加载会导致 N+1 查询问题。只有在我们对个别记录的懒加载字段感兴趣时，懒加载才有意义，但这种情况几乎不会发生。

因此，在所有的 `relationship` 中都使用 `lazy="selectin"` 来进行预加载可能是一种最佳实践。

### 关掉 `expire_on_commit`

`expire_on_commit` 似乎也没有存在的价值，它默认开启，平添了许多 I/O 操作，并且在异步下往往会因此报错，更糟糕的是，它几乎什么问题都没有解决。

例如下面这段代码，假设我开启了 `expire_on_commit`，并且没有在表定义种使用 `lazy="selectin"`，而是查询中指定 `options`,此时在 `commit` 事务后，`e` 会过期。

也许机智的我知道 `session.refresh(e)` 会刷新对象 `e` 的值。然而，其实这里即使 `refresh` 也不会重新加载 `company` 的值，因为 SQLAlchemy 并不能智能地知道这里的 `e` 是 `selectinload` 的查询查出来的结果。

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

## 总结

不知不觉已经太长了。很抱歉，它可能已经变得非常难以阅读。但 SQLAlchemy 的确是一个非常复杂的库，尤其是 ORM 部分，有数不清的魔法和陷阱。

其中也许有一些认知错误，欢迎大家一起讨论。我没有介绍 SQLAlchemy 的所有功能，例如索引、别名、Alembic 迁移等等，因为那些功能并不容易出错。其实上述讲的许多，在 SQLAlchemy 的文档中都有介绍，只是文档内容实在过多，而且新旧 API 混杂，实在难以消化。

希望这篇文章能帮助你更好地理解 SQLAlchemy，避免一些常见的错误。

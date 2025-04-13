---
title: SQLAlchemy 使用経験のまとめ
createdAt: 2025-04-11T01:00:05+09:00
updatedAt: 2025-04-13T12:43:55+09:00
tags:
  - ORM
  - Backend
  - SQLAlchemy
---

::alert{type="warning" title="Warning" content="この記事はLLMによって翻訳されました。"}
::

最新の構文による、シンプルな一対多関係の例です：

## モデル定義

モデル定義には多くの方法がありますが、その多くは歴史的な遺物です。ここでは SQLAlchemy 2.0 の推奨される方法のみを紹介します：

```python
class Base(DeclarativeBase): ...

class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True) # 主キー
    name: Mapped[str] = mapped_column()

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True) # 主キー
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id")) # 外部キー、会社テーブルと関連付け
```

上記のコードは、会社（Company）と従業員（Employee）の間の一対多関係を定義しています。各会社は複数の従業員を持つことができますが、各従業員は1つの会社にのみ所属します。

### 関係の定義

`relationship`を使用して関係を定義し、関連クエリを実現できます。

例えば、会社を照会する際に全ての従業員を取得したい場合は、`Company`クラスに`employees`属性を定義し、`relationship`を使って`Employee`テーブルと関連付けます。

```python
class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    employees: Mapped[List["Employee"]] = relationship() # 関連クエリ
```

もう一つのケースとして、従業員の所属会社を照会したい場合は、`Employee`クラスに`company`属性を定義し、`relationship`を使って`Company`テーブルと関連付けます。

```python
class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    company: Mapped["Company"] = relationship() # 関連クエリ
```

両方で関連クエリを行う可能性がある場合は、`Company`と`Employee`クラスの両方に`relationship`属性を定義できます。

この場合、SQLAlchemyに二つのクラス間の関係を構築する方法を知らせるために、**少なくとも一方**のクラスで`back_populates`属性を定義する必要があります。`back_populates`属性の値は、もう一方のクラスで定義された`relationship`属性の名前です。

```python
class Company(Base):
    __tablename__ = "companies"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    employees: Mapped[list["Employee"]] = relationship()  # 関連クエリ

class Employee(Base):
    __tablename__ = "employees"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column()
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
    company: Mapped["Company"] = relationship(back_populates="employees")  # 関連クエリ、逆関係も定義
```

### デフォルト値

`mapped_column`は`server_default`、`default`、`default_factory`パラメータをサポートしています。

`server_default`の「server」はデータベースを指します。これはテーブル作成時にフィールドのデフォルト値を指定します。

通常、`server_default`の方が良いでしょう。明らかな利点として、`default`を使用すると、オブジェクトを作成するたびにSQLステートメントに明示的に指定され、より冗長になります。

注意点として、`server_default`の値は数値型にできません。数値型のフィールドであっても、次のように文字列型の値を使用する必要があります：

```python
class TestTable(Base):
    __tablename__ = "test_table"
    default_field: Mapped[int] = mapped_column(server_default="0") # データベース側のデフォルト値
```

ただし、`default`の使用にも意味はあります。`default`を指定しない場合、オブジェクト作成後コミット前にそのフィールドにアクセスすると`None`が返されます。これが重要な場合（通常はそうではありません）、`default`を使用してデフォルト値を指定できます。

デフォルト値が参照型の場合、`default_factory`を使用する方が良いでしょう。そうしないと、全オブジェクトが同じ参照を共有するという一般的な落とし穴にはまります。

```python
class Test(Base):
    __tablename__ = "test"
    default_field: Mapped[list[str]] = mapped_column(ARRAY(String), default=[])  # defaultの誤用

session = Session()

t1 = Test()
t1.default_field.append("test")
print(t1.default_field)  # ['test']

t2 = Test()
print(t2.default_field)  # ['test']、t1とt2が同じ参照を共有
```

### タイムゾーンの落とし穴

これはSQLAlchemyと直接関係はありませんが、説明する価値があります。

タイムゾーンの処理は間違いやすいものです。シンプルな時間フィールドの定義は次のようになるかもしれません。作成時に時間を記録したい場合、`func.now()`を使用してサーバーの現在時刻を取得します：

```python
created_at: Mapped[datetime] = mapped_column(default=func.now())
```

しかし、これは期待と一致しない可能性が高いです。Postgresを例にとると、ここで宣言されたデータベースフィールドはデフォルトで`TIMESTAMP`型です。これはタイムゾーン情報を含まない時間型です。

自分は「タイムスタンプ」がUTC（グリニッジ標準時）を基準にしていると誤解していましたが、それは「Unixタイムスタンプ」の特性です。PostgreSQLのTIMESTAMP型はタイムゾーン情報を持たないただの時刻データです。

サーバーが日本にある場合、1970年1月1日00:00:00（日本時間）から現在までの時間間隔を保存します。ほとんどの人にとって、これは望ましくない結果です。これはUnixタイムスタンプではありません。

PostgreSQLは`TIMESTAMP WITH TIME ZONE`型を提供しており、これはUnixタイムスタンプを保存します。SQLAlchemyで`TIMESTAMP WITH TIME ZONE`を使用するには、次のようにフィールドを定義します：

```python
created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), default=func.now())
```

両者の違いは、どちらも datetime を返しますが、前者の tzinfo は `None` で、後者の tzinfo は UTC です。フロントエンドに返す際、datetime オブジェクトは ISO 8601 形式の文字列に変換されがちです。

```json
{
  "with_tz": "2025-04-12T18:32:18.420971Z", // 明確にUTC時間であることを示す
  "without_tz": "2025-04-12T18:32:18.420971" // このまま new Date(date) で解析すると時間が正しくないが、強引にUTC時間として扱えば正しいローカル時間を推測できる
}
```

違いは`with_tz`の時間の後ろに`Z`があり、UTC時間を示していることです。フロントエンドで`new Date("2025-04-12T18:32:18.420971Z")`でこの時間を解析すると、この時間は正しくローカル時間に変換されます。一方、`without_tz`はこの時間をローカル時間として解析します。UTC+0タイムゾーンにいるか、フロントエンドで手動でタイムゾーンを指定しない限り、誤った結果になります。

タイムゾーンが不要なシナリオはほとんどないので、積極的に`TIMESTAMP(timezone=True)`を明示しましょう。

アプリケーションサーバー時間ではなく、データベース時間を使用することを一般的に推奨します。データベースアプリケーションサーバーは世界中のどこにあるかもしれませんが、データベースクラスターは比較的中央集中型だからです。しかし、次のように書く人もいるかもしれません：

```python
default_datetime_now_tz: Mapped[datetime.datetime] = mapped_column(
    TIMESTAMP(timezone=True),
    default_factory=datetime.datetime.now,
)
```

これは別のエラーです。`datetime.datetime.now()`はアプリケーションサーバーのローカル時間を返し、サーバーがどのタイムゾーンにあるかを指定していません。したがって、データベースはこの時間をUTC時間として扱いますが、これは通常誤りです。

実際、いかなる場合も引数なしの`datetime.now()`を使用すべきではありません。タイムゾーン情報のない時間を返すため、ほとんど期待通りにはなりません。Ruff(DTZ005)が有効になっている場合、タイムゾーン情報を追加するよう促されます。

どうしても`datetime.now`で現在時刻を取得する必要がある場合は、次のようにタイムゾーンを指定すべきです：

```python
default_datetime_utcnow_tz: Mapped[datetime.datetime] = mapped_column(
    TIMESTAMP(timezone=True),
    default_factory=lambda: datetime.datetime.now(datetime.UTC),
)
```

要約すると、`TIMESTAMP WITH TIME ZONE`型のフィールドを使用し、作成時に`func.now()`を使用して現在時刻を取得すべきです。特別な状況でアプリケーションサーバー時間を使用する必要がある場合でも、必ずタイムゾーン情報を含めてください。

### ModelをDataclassへマッピング

Pythonの標準ライブラリの`dataclass`は、シンプルなデータクラスを定義するための便利なツールです。SQLAlchemyのORMオブジェクトを定義するのにも使用できます。

`dataclass`はオブジェクト構築時に非常に役立ちます。具体的には、`dataclass`を使用しない場合、デフォルトのコンストラクタ宣言は`(**kw: Any) -> Employee`です。ユーザーは、どの値を初期化する必要があるか、どの値にデフォルト値があるか、どの値を設定できないかを判断するのが難しいです。

例えば、通常`update_at`、`create_at`、`id`などのフィールドはデータベースによって自動生成されるべきで、ユーザーによって設定されるべきではありません。

`dataclass`は定義に基づいて自動的に`__init__`メソッドを生成するため、設定可能な値がわかります。

`MappedAsDataclass`クラスを継承すると、SQLAlchemyのORMオブジェクトをdataclassにマッピングできます。一般的に基本クラスで操作します：

```python
class Base(DeclarativeBase, MappedAsDataclass): ...
```

この時点で、`mapped_column`と`relationship`で`dataclass`のパラメータを使用できます。よく使われるのは`init`で、フィールドがコンストラクタに現れるかどうかを指定します。`dataclass`は`default`と`default_factory`もサポートしており、これらを使ってデフォルト値を指定できます。これらのパラメータは以前は`mapped_column`でのみ使用できましたが、今では`relationship`でも使用できます。

これにより、クラスの動作が少し変わります。明らかな変化は、もはやフィールドの順序を自由に指定できないことです。コンストラクタに現れるフィールド（`init=False`が設定されていない）の場合、デフォルト値のないフィールドはデフォルト値を持つフィールドの前になければならず、コンストラクタパラメータの順序と同じです。

ここにはいくつかの落とし穴があります。フィールドには3つのケースがあります：

1. デフォルト値が設定されていない。この場合、コンストラクタで必ずこのパラメータを提供する必要があります。
2. デフォルト値が設定されている。この場合、コンストラクタでこのパラメータを提供する必要はありません。
3. `init`が`False`。この場合、コンストラクタでこのパラメータを提供できません。

`Employee`クラスでは、もともと`company_id`と`company`は両方オプションでした。`dataclass`を使用する場合、最も近い動作は2です。つまり、`company_id`と`company`の両方にデフォルト値があります。Pythonには`undefined`のようなものがないため、デフォルト値を`None`に設定するしかありません。

これにより、従業員の会社を`company_id`で設定したい場合、`Employee(company_id=1)`と書くことになりますが、これは正常に動作しません。`company`のデフォルト値も`None`だからです。したがって、構築は`Employee(company_id=1, company=None)`と同等であり、`None`を提供することと提供しないことは同じではありません。前述したように、relationshipの値は外部キーの設定を上書きします。実際には会社を持たない従業員を作成していることになります。

ここで、元の動作が変更され、混乱を招きます。最善の方法として、外部キーフィールドと関連クエリ用の`relationship`フィールドの両方が存在する場合、`relationship`を`init=False`に設定することをお勧めします。これによりコンストラクタには表示されず、先ほど言及した問題も発生しません。

### フィールドの抽象化

前述のように、多くのテーブルはエントリのid、作成時間、更新時間を記録する必要があります。これらを抽象化できます：

```python
class BaseWithAudit(Base):
    __abstract__ = True
    id: Mapped[int] = mapped_column(primary_key=True, init=False)
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), init=False)
    updated_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now(), init=False)
```

ここでの`__abstract__`属性は、このクラスがテーブルとして作成されないことを示します。`id`、`created_at`、`updated_at`フィールドはこのクラスを継承する全てのテーブルで共有されます。

ここでは自動増分主キーを使用していますが、ユーザー規模を公開したくない場合、uuidを主キーとして使用する方が良いかもしれません。

### その他の設定

インデックスやユニーク制約など他の設定もありますが、これらはあまりエラーが発生しないため、紙面の制約上省略します。直接ドキュメントを参照してください。

## 準備作業

上記の一連の説明を経て、モデルを正しく定義しました。クエリを実行する前に、いくつかの準備作業が必要です。

`create_engine`でデータベースエンジンを作成し、`sessionmaker`でセッションクラスを作成します。すべてのデータベース操作はセッションインスタンスを通じて行われます。

```python
engine = create_engine(os.getenv("DB_URL"))
Session = sessionmaker(bind=engine)
```

SQLAlchemy ORMに準拠したデータベース構造を作成：

```python
Base.metadata.create_all(engine)
```

## クエリ

作成、削除、更新、照会の操作はすべて、`Session`オブジェクトをインスタンス化することで実行できます。

クエリ操作では、`session.get`を使って主キーに基づいて単一のオブジェクトを取得できます。

```python
session = Session()
company = session.get(Company, 1) # 主キーに基づいて1つの会社オブジェクトを照会
```

SQLステートメントを実行してクエリを行うこともできます。select関数をチェーン呼び出しでクエリステートメントを構築し、`session.execute`でクエリステートメントを実行します。

```python
stmt = select(Company).where(Company.name == "Google") # SELECT * FROM companies WHERE name = "Google" と同等
print(stmt) # 生成されたSQLステートメントを印刷
session.execute(stmt) # クエリステートメントを実行し、条件に一致するすべての会社を返す
```

返された結果はリザルトセットであり、データを取得するにはさらに処理が必要です。

このリザルトセットは反復可能で、内部データは**タプル配列**です。各行はデータベース内の1行のデータに対応します。各列はselect関数の各パラメータに対応します。

all()メソッドですべての結果を取得できます：

```python
session.execute(select(Company, Company.name)).all()
# [
#   (<Company id=1>, 'Apple'),
#   (<Company id=2>, 'Google'),
#   (<Company id=3>, 'Preferred Networks'),
# ]
```

ここでは意図的に`select(Company, Company.name)`を使用しています。返される結果はタプルであることがわかります。最初の要素は`Company`オブジェクトで、2番目の要素は`Company.name`の値です。

これは少し不便です。`Company`だけをクエリした場合でも、返された結果はやはりタプル配列です：

```python
session.execute(select(Company)).all()
# [
#   (<Company id=1>,),
#   (<Company id=2>,),
#   (<Company id=3>,),
# ]
```

SQLAlchemyでは`scalars()`メソッドを使って最初の列の結果を取得できます。他の列は無視されます。

```python
session.execute(select(Company.name, Company.id)).scalars().all() # ['Apple', 'Google', 'Preferred Networks']
```

さらに、最初の行の最初の列だけが必要な場合は、`scalar()`を使ってそれを取得できます。

```python
session.execute(select(Company.name)).scalar() # 'Apple'
```

scalarsとscalarはあまりにも一般的に使われるため、直接`session.scalars`または`session.scalar`を使ってクエリすることもできます。

```python
session.scalars(select(Company.name)).all() # session.execute(select(Company.name)).scalars().all()と同等
session.scalar(select(Company.name)) # session.execute(select(Company.name)).scalar()と同等
```

`all()`ですべての要素を取得する以外に、一般的には`first()`、`one()`、`one_or_none()`などのメソッドを使用して1行の要素を取得します。これらの動作は少し異なります：

| 条件                     | `first()`      | `one()`      | `one_or_none()` |
| ------------------------ | -------------- | ------------ | --------------- |
| 結果セットが複数行の場合 | 最初の行を返す | 例外をスロー | 例外をスロー    |
| 結果セットが空の場合     | Noneを返す     | 例外をスロー | Noneを返す      |

### 作成、削除、更新

`session.add`と`session.delete`を使用して作成、削除、更新操作を行うと、ほとんどのニーズを満たせます：

```python
session = Session()
company = Company(name="Test Company", id=1)
session.add(company)
session.commit() # この時点でINSERTステートメントが実行され、会社がデータベースに追加される
company.name = "New Company"
session.commit() # この時点でUPDATEステートメントが実行され、会社の名前がNew Companyに変更される
session.delete(company) # 会社を削除
session.commit() # この時点でDELETEステートメントが実行され、会社がデータベースから削除される
```

この方法の利点は、ORMオブジェクトを分析して最適なステートメントを生成することです：

```python
session = Session()
alice = Employee(name="Alice", id=1, company_id=1)
session.add(alice)  # Aliceという従業員を追加

apple = Company(name="Apple", id=1)
session.add(apple)  # Apple社を追加

bob = Employee(name="Bob", id=2, company=Company(name="Google", id=2))  # Bob従業員を追加し、直接company オブジェクトを設定
session.add(bob)  # Bob従業員を追加
session.commit()
```

上記のコードは完全に合法です。SQLAlchemyは先に会社を作成し、その後従業員を追加する必要があることを認識しています。そうでなければ外部キーの競合が発生します。また、`bob`の会社は`Google`ですが、`Google`会社を作成せず、直接`Company(name="Google", id=2)`を使用しました。SQLAlchemyは自動的に`Google`会社を作成します。

また、このコミットでは実際には2つの`INSERT`ステートメントのみが実行され、会社と従業員の作成がそれぞれマージされてより効率的な挿入ロジックが形成されることも注目に値します：

```sql
INSERT INTO companies (id, name) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR)
-- [generated in 0.00015s] [{'id': 1, 'name': 'Apple'}, {'id': 2, 'name': 'Google'}]

INSERT INTO employees (id, name, company_id) VALUES (%(id)s::INTEGER, %(name)s::VARCHAR, %(company_id)s::INTEGER)
-- [generated in 0.00011s] [{'id': 1, 'name': 'Alice', 'company_id': 1}, {'id': 2, 'name': 'Bob', 'company_id': 2}]
```

### 外部キーフィールドを使用するか、リレーションシップフィールドを使用するか？

company_idを通じて従業員の会社を指定することも、companyオブジェクトを通じて従業員の会社を指定することもできることに気づいたかもしれません。気になるのは、矛盾する値を指定した場合どうなるのかということです。

```python
apple = Company(name="Apple", id=1)
session.add(apple)  # Apple会社を追加
google = Company(name="Google", id=2)
session.add(google)  # Google会社を追加
alice = Employee(name="Alice", id=1, company_id=1, company=google)  # id=1はApple会社、companyはGoogleを指定。AliceはAppleとGoogleのどちらに属する？
session.add(alice)
session.commit()  # トランザクションをコミット
assert alice.company_id == 2
```

実験の結果、オブジェクトの値がより優先されることがわかりました。つまり、`company_id`と`company`の両方を指定すると、`company`の値が`company_id`の値を上書きします。これは警告なく行われ、少し不安を感じさせます。

ベストプラクティスとして、relationshipの値を直接設定せず、外部キー列を使用して関係を設定することをお勧めします。つまり、`company_id`を使用して従業員の会社を設定します。オブジェクトの取得にはコストがかかる可能性がありますが、オブジェクトを既に取得している場合でも、その主キーに簡単にアクセスして関係設定に使用できます。

### SQLステートメントを使用したクエリ

完全なコントロールが必要な場合は、`session.execute`を使用してSQLステートメントを実行する方法があります。

```python
session = Session()
session.execute(insert(Company).values(id=1, name="Test Company")) # INSERTステートメントを実行して会社をデータベースに追加
```

`session.query`を使用してクエリを行うという別の使用方法を見ることもあるかもしれませんが、これは時代遅れの使用法であり、使用しないことをお勧めします。

## ORMオブジェクトは統一されている

SQLAlchemyの背後には多くのマジックが存在します。例えば、同じセッション内では、同じオブジェクトはメモリに1つしか存在しません。また、さまざまな修正操作はクエリで取得したオブジェクトにも影響します。

```python
company = Company(name="Test Company", id=1)

session.add(company)
session.commit()

company_1 = session.get(Company, 1)
assert company_1 is company  # True、クエリしたオブジェクトと以前に追加したオブジェクトは同じオブジェクト

session.execute(update(Company).where(Company.id == 1).values(name="New Company")) # 会社の名前を変更
session.commit()

assert company.name == "New Company"  # 不思議なことに、以前に存在していたオブジェクトの値も変更された
```

この不思議な動作は便利ですが、混乱を招くこともあります。

## 遅延ロードについて

`relationship`には重要なパラメータ`lazy`があり、ロード方法を指定するために使用します。

`lazy`のデフォルト値は`select`です。これは「このフィールドにアクセスする時、`select`クエリで遅延的にフィールドの値をロードする」という意味です。つまり、デフォルトでは遅延ロード（Lazy Loading）が行われます。

```python
class Company(Base):
    # その他のコードは省略
    employees: Mapped[List["Employee"]] = relationship() # デフォルトはlazy="select"、遅延ロードされる

session = Session()
employees = session.scalars(select(Employee)).all()
for employee in employees:
    logger.info("Employee: %s, Company: %s", employee.name, employee.company.name)
```

データベースに3つの会社があり、各会社に3人の従業員がいる場合、次のような出力が生成される可能性があります：

```sql
BEGIN (implicit)

# すべての従業員を照会
SELECT employees.id, employees.name, employees.company_id
FROM employees
-- [generated in 0.00012s] {}

# id=1の会社を照会
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [generated in 0.00013s] {'pk_1': 1}

-- Employee: Brian Baker, Company: Brown-Spencer
-- Employee: Karen Payne, Company: Brown-Spencer
-- Employee: Stephanie Bradley, Company: Brown-Spencer

# id=2の会社を照会
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [cached since 0.002736s ago] {'pk_1': 2}

-- Employee: Joseph Howard, Company: Cooper, Hunt and Long
-- Employee: Amanda Brooks, Company: Cooper, Hunt and Long
-- Employee: Lindsay Grant, Company: Cooper, Hunt and Long

# id=3の会社を照会
SELECT companies.id AS companies_id, companies.name AS companies_name
FROM companies
WHERE companies.id = %(pk_1)s::INTEGER
-- [cached since 0.00426s ago] {'pk_1': 3}

-- Employee: Cynthia Pittman, Company: Pope Ltd
-- Employee: Amanda Cook, Company: Pope Ltd
-- Employee: James Fernandez, Company: Pope Ltd
```

まず全従業員が照会され、各従業員の会社にアクセスする時に初めて会社テーブルが照会されることがわかります。
これが遅延ロード（Lazy Loading）です。

従業員を照会する際に会社情報が必要ない場合が多いため、遅延ロードには意味があります。

しかしこれによりN+1クエリ問題が発生します。9人の従業員を全て取得するために1回のクエリを行い、その後各従業員の会社情報を取得するためにクエリを行います。クエリ数が多く、クエリ速度が大幅に遅くなります。

ここで細かい点があります：実際は9+1=10回のクエリではなく、3+1=4回です。理由は、1つのセッション内でSQLAlchemyはクエリ結果をキャッシュできるためです。同じ会社の情報にアクセスする場合、SQLAlchemyはキャッシュから直接取得し、データベースに再度クエリしません。したがって、従業員の会社情報に9回アクセスしましたが、実際には3つの会社に分かれているため、実際のデータベースクエリは追加で3回だけです。

いずれにしても、従業員の会社情報にアクセスする必要がある場合、遅延ロードはクエリ数を大幅に増やします。
relationshipで`lazy`パラメータを使用すると、事前ロード（Eager Loading）を指定できます。

これは非常に直感的ではありません。`lazy`パラメータを書かなければ遅延ロードが使用され、逆に`lazy`を書くと遅延ロードされなくなります。

以下では、いくつかの事前ロードモードを紹介します。これらのクエリのパフォーマンスには微妙な違いがありますが、一般的に`selectin`のパフォーマンスが最も良いでしょう。

### joinedを使った事前ロード

lazyが`joined`に設定されている場合、Employeeを照会する際、JOINステートメントを使用してCompanyテーブルをEmployeeテーブルに結合します。

```sql
BEGIN (implicit)
SELECT employees.id, employees.name, employees.company_id, companies_1.id AS id_1, companies_1.name AS name_1
FROM employees LEFT OUTER JOIN companies AS companies_1 ON companies_1.id = employees.company_id
-- [generated in 0.00012s] {}
```

### selectinを使った事前ロード

lazyが`selectin`に設定されている場合、Employeeを照会する際、2番目のクエリが発生し、IN句を使用して全従業員の会社をフィルタリングします。

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

### subqueryを使った事前ロード

subquery事前ロードも2回のクエリを必要とします。

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

### クエリ時にロード方法を決定

クエリ時にロード方法を決定することもできます。

```python
stmt = select(Employee).options(selectinload(Employee.company)) # クエリ時に、Employeeテーブルのcompanyフィールドにselectin事前ロードを使用
```

## トランザクション管理

クエリには以下のような状態があります：

1. 未コミット（pending）：トランザクションがまだコミットされておらず、データがまだデータベースに書き込まれていない。
2. 変更済み（flushed）：データはデータベースに書き込まれているが、トランザクションはまだコミットされていない。この時点では現在のセッションだけが変更を見ることができる。
3. トランザクションコミット済み（committed）：データがデータベースに書き込まれ、トランザクションがコミットされている。この時点ですべてのセッションが変更を見ることができる。

### flush

`session.flush()`を使用して変更をデータベースにコミットしますが、トランザクションはコミットしません。これは、現在のセッションでは変更が見えるが、他のセッションでは見えないことを意味します。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush() # 変更をデータベースにコミットするが、トランザクションはコミットしない

assert session.get(Company, 1).id == 1  # 先程追加した会社をクエリできる

new_session = Session()
assert new_session.get(Company, 1) is None  # 他のセッションではクエリできない、トランザクションがコミットされていないため
```

### commit

`session.commit()`を通じてトランザクションをコミットできます。これは変更が実際に有効になることを意味します。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.commit() # トランザクションをコミット

new_session = Session()
assert new_session.get(Company, 1).id == 1  # 他のセッションでもクエリできる、トランザクションがコミットされたため
```

### rollback

`session.rollback()`を通じて、まだコミットされていないトランザクションをロールバックできます。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush()  # 変更をデータベースにコミットするが、トランザクションはコミットしない
assert session.get(Company, 1).id == 1  # この時点でクエリできる
session.rollback()  # トランザクションをロールバックし、変更を取り消す
assert session.get(Company, 1) is None  # この時点でクエリできない
```

間違った例として、トランザクションが既にcommitでコミットされている場合、ロールバックはできません：

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.commit()  # トランザクションをコミット
assert session.get(Company, 1).id == 1  # この時点でクエリできる
session.rollback()  # トランザクションをロールバックし、変更を取り消す
assert session.get(Company, 1).id == 1  # この時点でもクエリできる、トランザクションが既にコミットされているためロールバックできない
```

また、セッションがコミットせずに閉じられた場合、そのセッション内のすべての変更はロールバックされます。

```python
session = Session()
session.add(Company(name="Test Company", id=1))
session.flush()  # 変更をデータベースにコミットするが、トランザクションはコミットしない
session.close()  # セッションを閉じる、この時点でトランザクションがロールバックされ、すべての変更が取り消される
```

### flush、commit、rollbackの連携使用

データベースの複数の変更の原子性を確保する必要がよくあります。つまり、すべて成功するか、すべて失敗するかのいずれかです。
失敗した場合はロールバックする必要があります。

```python
session = Session()
try:
    session.add(Company(name="Test Company", id=1))
    session.flush() # 変更をデータベースにコミットするが、トランザクションはコミットしない
    raise Exception("Test exception") # 例外をシミュレート
    session.commit() # トランザクションをコミット
except Exception:
    session.rollback() # トランザクションをロールバックし、すべての変更を取り消す
```

### beginを使った管理

実践では、手動で`commit`や`rollback`を行うのではなく、`session.begin()`を使用してトランザクションを管理することをお勧めします。

```python
session = Session()
with session.begin():
    session.add(Company(name="Test Company", id=1)) # 会社を追加

# withステートメントを出ると、トランザクションは自動的にコミットされます。また、例外が発生した場合、トランザクションは自動的にロールバックされます
new_session = Session()
assert new_session.get(Company, 1) is not None  # 他のセッションでもクエリできる、トランザクションがコミットされたため
```

`session.begin_nested()`を使用してネストしたトランザクションを作成できます。

```python
    with session.begin():
        session.add(Company(name="Test Company", id=1))
        with session.begin_nested():
            session.add(Employee(name="Test Employee", id=1, company_id=1))
            session.add(Employee(name="Test Employee 2", id=2, company_id=1))
```

### autoflush

デフォルトでは、SQLAlchemyのauto flush機能は有効になっています。しかし、これはsession.addなどの操作のたびにflushが行われることを意味するわけではありません。実際には、この機能を有効にすると、クエリの前に自動的にflushが行われます。

```python
session = sessionmaker(bind=engine)(autoflush=True) # デフォルトでは有効です、ここでは明示的に有効にしていますが、省略可能です
company = Company(name="Google", id=1)
session.add(company)
assert session.get(Company, 1) is not None # 変更はコミットされていませんが、トランザクションもコミットされていません。しかし、クエリの前に自動flushが行われるため、クエリできます
```

autoflushを無効にするとどうなるでしょうか？

```python
session = sessionmaker(bind=engine, autoflush=False)() # 自動flushを無効にする
company = Company(name="Google", id=1)
session.add(company)
assert session.get(Company, 1) is None # None、自動flushがないため
```

注意すべきは、`session.flush()`は`session.add()`や`session.delete()`と組み合わせて使用する場合にのみ関連があることです。`session.add()`メソッドで追加されたオブジェクトや、`session.delete()`メソッドで削除されたオブジェクトにのみ影響します。

言い換えれば、`session.execute`を直接使用してSQLステートメントを実行する場合、`autoflush`の影響を受けません。

```python
session = sessionmaker(bind=engine, autoflush=False)()
session.execute(insert(Company).values(id=1, name="Google")) # executeはflushを必要とせず、クエリを自動的にコミットします
assert session.get(Company, 1) is not None # executeで挿入した場合、自動flushがなくてもクエリできます
```

``autoflush`はあまり有用な機能ではないと感じます。むしろ混乱を招く可能性があるため、無効にすることをお勧めします。

### expire_on_commit

SQLAlchemyの`expire_on_commit`機能はデフォルトで有効になっています。つまり、トランザクションをコミットした後、すべてのオブジェクトは期限切れと見なされます。この機能は非常に微妙なシナリオでのみ有用です：

下記のコードに示すように、コミット後に別のセッションがオブジェクトの値を変更した場合、expire on commit機能が無効になっていると、期限切れの値にアクセスします。

```python
Session = sessionmaker(bind=engine, expire_on_commit=False)
session = Session()
c = Company(name="Google", id=1)
session.add(c)
session.commit()

# 別のセッションで会社の名前を変更
other_session = Session()
other_session.execute(update(Company).where(Company.id == 1).values(name="Meta"))
other_session.commit()

assert c.name == 'Google' # 期限切れになっていないため、まだGoogleと表示される
```

興味深いことに、同じセッション内でオブジェクトの値を変更した場合、この問題は発生しません。SQLAlchemyは裏でオブジェクト`c`が変更されたことを魔法のように認識し、新しい値を設定します。

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

個人的には、`expire_on_commit`機能を有効にする理由はあまりないと思います。コミット後に別のセッションによる変更を常に反映する必要があるでしょうか？それに、データをリフレッシュしても、その直後（データ転送中など）に変更される可能性があり、完全な一貫性は保証できません。

また、SQLAlchemyに関する多くの説明では、`expire_on_commit`を`False`に設定しています（例えば[Litestar](https://docs.litestar.dev/2/tutorials/sqlalchemy/0-introduction.html)や[公式ドキュメント](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)など）。

## 非同期

SQLAlchemyは非同期操作をサポートしています。非同期のエンジンとセッションを構築するだけです。

```python
async_engine = create_async_engine(os.getenv("DB_URL"))
AsyncSession = async_sessionmaker(bind=async_engine)
```

しかし、非同期の世界は同期とは全く異なります。

最大の違いは、非同期の世界には暗黙的なI/Oがないことです。I/O操作を行うには、明示的に`await`を使用する必要があります。

SQLAlchemyではいつI/Oが実行されるかは必ずしも明白ではありません。

```python
session = AsyncSession()
async with session.begin():
    session.add(Company(name="Google", id=1))
    await session.commit() # この時点でI/O操作があり、トランザクションをコミット
    company = await session.get(Company, 1) # id=1の会社をクエリし、この時点でI/O操作がある
    select_stmt = select(Company).where(Company.name == "Google") # この時点ではI/O操作はなく、SQLステートメントが生成されるだけ
    result = await session.execute(select_stmt) # この時点でI/O操作があり、クエリステートメントを実行
    companies = result.scalars().all() # この時点ではI/O操作はなく、クエリ結果を処理するだけ
```

`session.commit()`と`session.execute()`はどちらもI/O操作であることがわかります。これらを完了させるために`await`を使用する必要があります。一方、`session.add()`や`select()`はI/O操作ではありません。これらはオブジェクトをセッションに追加したり、SQLステートメントを生成するだけです。

非同期環境では遅延ロードを使用するのが難しいです。`Company`と`Employee`の関係が遅延ロードであり、つまりデフォルトの`lazy="select"`を使用している場合、次の（同期）コードは2回のクエリを行います：

```python
with Session() as session:
    b = session.get(Employee, 1) # id=1の従業員をクエリ
    print(b.company.name) # 従業員の会社名を遅延クエリ
```

パフォーマンスが少し悪いだけで、問題なく動作します。

しかし非同期では、このコードはエラーになります：

```python
async with AsyncSession() as session, session.begin():
    a = await session.get(Employee, 1)
    logger.info(a.company.name) # sqlalchemy.exc.MissingGreenlet
```

このエラーは理解できます。非同期では、すべてのI/O操作は明示的なawaitが必要です。しかし、`a.company`にアクセスする際、SQLAlchemyはI/O操作を行う必要がありますが、awaitがありません。

実際、エラーが発生することは必ずしも悪いことではありません。できるだけ暗黙的なI/Oを避けるべきだと思います。もしセッション内で遅延ロードフィールドを使用する予定があれば、前もってロードするべきです。そうでなければパフォーマンスに影響します。

### 非同期遅延ロード

もし本当に遅延ロードを使用してデータにアクセスする必要がある場合（通常は必要ありません）、`AsyncAttrs`を使用できます。これには基本クラスを変更する必要があります：

```python
class Base(AsyncAttrs, DeclarativeBase):
    pass
```

そして次のようにフィールドを`await`できます：

```python
name = await a.awaitable_attrs.company.name
```

個人的にはこの方法は非常に不自然だと感じます。また、`session.run_sync`を使用することもできます：

```python
name = await session.run_sync(lambda _: a.company.name)
```

この方法では基本クラスを変更する必要がありません。この方法は実際に新しいスレッドを起動してクエリを実行します。これらはほぼ同じです。

## おそらくベストプラクティス

SQLAlchemyの非同期APIは、慣れるまでにいくつかの困難がありました。コードは予想外の場所でさまざまなエラーを報告します。これらのエラーを防ぐために、次のように書くべきかもしれません：

### デフォルトの遅延ロードを使用しない

デフォルトの遅延ロード戦略にはほとんど価値がありません。

まず、非同期の並行性能が高いため、開発では非同期を優先します。このとき、明示的にawaitを宣言する必要があり、これはI/O操作がどこで行われるかを明確に知る必要があることを意味します。これにより開発時の精神的負担は軽減されず、逆に実行時にエラーが報告されるだけです。

また、遅延ロードフィールドが必要かどうかは多くの場合予測可能です。そして遅延ロードフィールドに全く興味がないか、各行の遅延ロードフィールドにすべて興味があるかのどちらかです。前者の場合、遅延ロードは無意味です。後者の場合、遅延ロードによりN+1クエリ問題が発生します。個々のレコードの遅延ロードフィールドに興味がある場合にのみ遅延ロードは意味がありますが、このケースはほとんど発生しません。

したがって、すべての`relationship`で`lazy="selectin"`を使用して事前ロードすることがベストプラクティスかもしれません。

### `expire_on_commit`をオフにする

`expire_on_commit`にも価値がないように見えます。デフォルトで有効になっており、多くのI/O操作を追加し、非同期ではエラーを引き起こすことがよくありますが、さらに悪いことに、ほとんど何の問題も解決していません。

例えば次のコードでは、`expire_on_commit`を有効にしており、テーブル定義で`lazy="selectin"`を使用せず、代わりにクエリで`options`を指定している場合、トランザクションを`commit`した後、`e`は期限切れになります。

賢明な私は`session.refresh(e)`がオブジェクト`e`の値をリフレッシュすることを知っているかもしれません。しかし、実際にはここで`refresh`しても`company`の値は再ロードされません。なぜならSQLAlchemyは`e`が`selectinload`クエリの結果であることを知ることができないからです。

```python
async def main():
    async with AsyncSession() as session:
        e = await session.scalar(select(Employee).where(Employee.name == "John Doe").options(selectinload(Employee.company)))
        logger.info(f"Employee: {e.company.name}")
        await session.commit()
        await session.refresh(e)
        logger.info(f"Employee: {e.company.name}") # エラー
```

### 各セッションで最後に1回だけcommitする

前の分析から、`commit`後に他の操作を行うと、様々な問題が発生することがわかります。実際には、各`session`で1回だけ`commit`することは非常に良い実践です。これにより上記の一連の問題を回避し、原子性を保証します。

特にWebアプリケーションでは、`session`のライフサイクルがリクエストのライフサイクルと一致している場合、管理がはるかに容易になります。

したがって、手動で`commit`するよりも、`session.begin()`を使用してトランザクションを管理する方が良い選択肢です。セッションの作成とbeginを一緒に配置し、コード内で`session.commit()`、`session.rollback()`などの操作が不要になり、`try...catch`ステートメントも必要なくなり、より簡潔になります。

## まとめ

いつの間にか文章が長くなってしまいました。読みにくくなってしまい申し訳ありません。しかし、SQLAlchemyは実際に非常に複雑なライブラリであり、特にORM部分には数多くの隠れた仕組みや落とし穴が存在します。

異なる意見をお持ちの方もいらっしゃるかもしれませんが、ぜひ皆さんとの議論を歓迎します。なお、SQLAlchemyの全機能（インデックス、エイリアス、Alembic移行など）については触れていません。これらは比較的エラーが発生しにくい機能だからです。

実際、上記で説明した多くの内容はSQLAlchemyの公式ドキュメントにも記載されていますが、膨大な情報量と新旧APIの混在により、適切に理解するのは難しいと思います。

この記事がSQLAlchemyへの理解を深め、一般的なエラーを回避する助けになれば幸いです。

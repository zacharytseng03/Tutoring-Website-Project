# Database Description:

The database is using PostgreSQL. It is hosted on ElephantSQL 
- [DDL + Seed Data](MainDB.sql)
- [SQL required for Demo](Demo/Demo.sql)
- [Other SQL](Operations.sql)

Note: The SQL used in the Demo file as well as the Operations file has been slightly modified to be able to pass variables from the backend. The general syntax and usecase is still the same however. The code where the actual SQL gets executed is found in [Routes.ts](../src/api/Routes.ts). The DDL file is ready to use as is.

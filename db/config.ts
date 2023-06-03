let dbConfig;

if (process.env.NODE_ENV == 'production') {
  dbConfig = {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'taskhub',
    models: [],
  };
} else if (process.env.NODE_ENV == 'test') {
  dbConfig = {
    dialect: 'sqlite',
    storage: 'taskhub.sqlite',
    synchronize: true,
    autoLoadModels: true,
  };
} else {
  dbConfig = {
    dialect: 'sqlite',
    storage: 'taskhub.sqlite',
    synchronize: true,
    autoLoadModels: true,
  };
}

export default dbConfig;

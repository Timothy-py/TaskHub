let dbConfig;

if (process.env.NODE_ENV == 'production') {
  dbConfig = {
    dialect: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    // models: [],
    autoLoadModels: true,
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

// mysqlsh --uri=mysql://root:787@yk4u@localhost:3306/taskhub

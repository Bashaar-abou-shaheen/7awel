export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  database: {
    type: 'sqlite' as const,
    database: process.env.DB_PATH ?? 'promotions.db',
  },
});

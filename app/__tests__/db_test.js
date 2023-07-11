import SqlDb from "../util/db";

test('Database connection', async () => {
  let db = SqlDb.getConnection()
  expect(db).not.toBeNull();
});
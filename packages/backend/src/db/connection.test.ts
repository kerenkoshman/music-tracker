import { db, client } from './connection';

describe('Database Connection', () => {
  afterAll(async () => {
    // Close the database connection after tests
    await client.end();
  });

  it('should connect to the database successfully', async () => {
    // Test a simple query to verify connection
    const result = await db.execute('SELECT 1 as test');
    expect(result).toBeDefined();
    expect(result.rows).toBeDefined();
    expect(result.rows[0]).toEqual({ test: 1 });
  });

  it('should handle database errors gracefully', async () => {
    // Test an invalid query
    await expect(
      db.execute('SELECT * FROM non_existent_table')
    ).rejects.toThrow();
  });

  it('should maintain connection pool', async () => {
    // Test multiple concurrent queries
    const promises = Array.from({ length: 5 }, (_, i) => 
      db.execute(`SELECT ${i + 1} as number`)
    );

    const results = await Promise.all(promises);
    
    results.forEach((result, index) => {
      expect(result.rows[0]).toEqual({ number: index + 1 });
    });
  });
});

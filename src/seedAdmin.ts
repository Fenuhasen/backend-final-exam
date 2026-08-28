import bcrypt from 'bcrypt';
import pool from './config/db';

async function seedAdmin(): Promise<void> {
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
        throw new Error('ADMIN_PASSWORD is required');
    }

    const firstName = process.env.ADMIN_FIRST_NAME || 'Alice';
    const lastName = process.env.ADMIN_LAST_NAME || 'Admin';
    const email = process.env.ADMIN_EMAIL || 'alice.admin@test.com';
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        `INSERT INTO users (first_name, last_name, mail, password, role, status)
    VALUES ($1, $2, $3, $4, 'ADMIN', 'ACTIF')
    ON CONFLICT (mail) DO NOTHING
    `,
        [firstName, lastName, email, hashedPassword]
    );

    console.log(`Admin seeded: ${email}`);
}

seedAdmin()
    .catch((error: unknown) => {
        console.error(
            'Unable to create administrator:',
            error instanceof Error ? error.message : error
        );
        process.exitCode = 1;
    })
    .finally(() => pool.end());

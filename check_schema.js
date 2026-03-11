const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error accessing users table:", error);
    } else if (data && data.length > 0) {
        console.log("Columns in users table:", Object.keys(data[0]));
    } else {
        console.log("Users table is empty. Trying to get column names from information_schema...");
        const { data: cols, error: colError } = await supabaseAdmin.rpc('get_table_columns', { table_name: 'users' });
        if (colError) {
            // Fallback: try a direct query to information_schema if rpc doesn't exist
            const { data: infoCols, error: infoError } = await supabaseAdmin.from('information_schema.columns').select('column_name').eq('table_name', 'users');
            if (infoError) {
                console.log("Could not determine columns. Assuming standard schema.");
            } else {
                console.log("Columns:", infoCols.map(c => c.column_name));
            }
        } else {
            console.log("Columns:", cols);
        }
    }
}

checkSchema();

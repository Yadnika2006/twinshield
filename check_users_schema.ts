import { supabaseAdmin } from "./lib/supabase.ts";

async function checkSchema() {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error accessing users table:", error);
    } else {
        console.log("Columns in users table:", Object.keys(data[0] || {}));
    }
}

checkSchema();

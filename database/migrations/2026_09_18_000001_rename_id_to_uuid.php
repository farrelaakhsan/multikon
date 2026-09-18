<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $tables = [
        'users'             => 'user_id',
        'products'          => 'product_id',
        'orders'            => 'order_id',
        'order_items'       => 'order_item_id',
        'order_documents'   => 'order_document_id',
        'b2b_applications'  => 'b2b_application_id',
        'cart_items'        => 'cart_item_id',
        'addresses'         => 'address_id',
        'conversations'     => 'conversation_id',
        'messages'          => 'message_id',
        'chats'             => 'chat_id',
        'payment_settings'  => 'payment_setting_id',
    ];

    private array $foreignKeys = [
        ['table' => 'chats',            'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'messages',         'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'messages',         'column' => 'conversation_id',   'ref_table' => 'conversations'],
        ['table' => 'conversations',    'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'addresses',        'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'cart_items',       'column' => 'product_id',        'ref_table' => 'products'],
        ['table' => 'cart_items',       'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'b2b_applications', 'column' => 'reviewed_by',       'ref_table' => 'users'],
        ['table' => 'b2b_applications', 'column' => 'user_id',           'ref_table' => 'users'],
        ['table' => 'order_documents',  'column' => 'order_id',          'ref_table' => 'orders'],
        ['table' => 'order_items',      'column' => 'product_id',        'ref_table' => 'products'],
        ['table' => 'order_items',      'column' => 'order_id',          'ref_table' => 'orders'],
        ['table' => 'orders',           'column' => 'product_id',        'ref_table' => 'products'],
        ['table' => 'orders',           'column' => 'user_id',           'ref_table' => 'users'],
    ];

    private array $newFKConstraints = [
        ['table' => 'orders',           'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => true],
        ['table' => 'orders',           'column' => 'product_id',        'ref_table' => 'products',     'ref_column' => 'product_id', 'nullable' => true],
        ['table' => 'order_items',      'column' => 'order_id',          'ref_table' => 'orders',       'ref_column' => 'order_id', 'nullable' => false],
        ['table' => 'order_items',      'column' => 'product_id',        'ref_table' => 'products',     'ref_column' => 'product_id', 'nullable' => true],
        ['table' => 'order_documents',  'column' => 'order_id',          'ref_table' => 'orders',       'ref_column' => 'order_id', 'nullable' => false],
        ['table' => 'b2b_applications', 'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => false],
        ['table' => 'b2b_applications', 'column' => 'reviewed_by',       'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => true],
        ['table' => 'cart_items',       'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => false],
        ['table' => 'cart_items',       'column' => 'product_id',        'ref_table' => 'products',     'ref_column' => 'product_id', 'nullable' => false],
        ['table' => 'addresses',        'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => false],
        ['table' => 'conversations',    'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => false],
        ['table' => 'messages',         'column' => 'conversation_id',   'ref_table' => 'conversations', 'ref_column' => 'conversation_id', 'nullable' => false],
        ['table' => 'messages',         'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => true],
        ['table' => 'chats',            'column' => 'user_id',           'ref_table' => 'users',        'ref_column' => 'user_id', 'nullable' => false],
    ];

    private function columnExists(string $table, string $column): bool
    {
        $cols = DB::select("SHOW COLUMNS FROM `{$table}`");
        return collect($cols)->contains('Field', $column);
    }

    private function getColumnType(string $table, string $column): ?string
    {
        $cols = DB::select("SHOW COLUMNS FROM `{$table}`");
        $col = collect($cols)->firstWhere('Field', $column);
        return $col?->Type;
    }

    private function isColumnNullable(string $table, string $column): bool
    {
        $cols = DB::select("SHOW COLUMNS FROM `{$table}`");
        $col = collect($cols)->firstWhere('Field', $column);
        return $col && $col->Null === 'YES';
    }

    private function dropForeignKeyIfExists(string $table, string $column): void
    {
        $rows = DB::select(
            "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL",
            [$table, $column]
        );
        foreach ($rows as $row) {
            DB::statement("ALTER TABLE `{$table}` DROP FOREIGN KEY `{$row->CONSTRAINT_NAME}`");
        }
    }

    private function dropIndexIfExists(string $table, string $column): void
    {
        $indexes = DB::select("SHOW INDEX FROM `{$table}` WHERE Column_name = ? AND Key_name != 'PRIMARY'", [$column]);
        foreach ($indexes as $idx) {
            DB::statement("DROP INDEX `{$idx->Key_name}` ON `{$table}`");
        }
    }

    public function up(): void
    {
        $tables = $this->tables;
        $foreignKeys = $this->foreignKeys;
        $newFKConstraints = $this->newFKConstraints;

        // ── STEP 1: Add UUID PK columns if missing + populate ──────────────
        foreach ($tables as $table => $uuidCol) {
            if (!$this->columnExists($table, $uuidCol)) {
                Schema::table($table, function (Blueprint $t) use ($uuidCol) {
                    $t->char($uuidCol, 36)->nullable();
                });
            }
            DB::statement("UPDATE `{$table}` SET `{$uuidCol}` = UUID() WHERE `{$uuidCol}` IS NULL OR `{$uuidCol}` = ''");
        }

        // ── STEP 2: Drop ALL foreign key constraints BEFORE touching data ──
        foreach ($foreignKeys as $fk) {
            $this->dropForeignKeyIfExists($fk['table'], $fk['column']);
        }

        // ── STEP 3: Convert FK columns from BIGINT → CHAR(36) ─────────────
        //    We MUST do this while old `id` still exists, so we can JOIN.
        foreach ($foreignKeys as $fk) {
            $table = $fk['table'];
            $column = $fk['column'];
            $refTable = $fk['ref_table'];
            $refUuidCol = $tables[$refTable];

            if (!$this->columnExists($table, $column)) {
                continue;
            }

            $colType = $this->getColumnType($table, $column);
            if ($colType && str_contains($colType, 'int')) {
                // Integer column — convert via JOIN on old `id`
                // First create a temp column
                $tempCol = $column . '_uuid_temp';
                if (!$this->columnExists($table, $tempCol)) {
                    Schema::table($table, function (Blueprint $t) use ($tempCol) {
                        $t->char($tempCol, 36)->nullable();
                    });
                }

                // Populate temp column with UUID from parent table via old integer FK → old id → parent UUID
                DB::statement(
                    "UPDATE `{$table}` INNER JOIN `{$refTable}` ON `{$table}`.`{$column}` = `{$refTable}`.`id` " .
                    "SET `{$table}`.`{$tempCol}` = `{$refTable}`.`{$refUuidCol}`"
                );

                // Drop old integer column
                $this->dropIndexIfExists($table, $column);
                Schema::table($table, function (Blueprint $t) use ($column) {
                    $t->dropColumn($column);
                });

                // Rename temp to original
                Schema::table($table, function (Blueprint $t) use ($tempCol, $column) {
                    $t->renameColumn($tempCol, $column);
                });
            } elseif ($colType && !str_contains($colType, 'char') && !str_contains($colType, 'varchar') && !str_contains($colType, 'text')) {
                // Some other non-string type — same conversion
                $tempCol = $column . '_uuid_temp';
                if (!$this->columnExists($table, $tempCol)) {
                    Schema::table($table, function (Blueprint $t) use ($tempCol) {
                        $t->char($tempCol, 36)->nullable();
                    });
                }

                DB::statement(
                    "UPDATE `{$table}` INNER JOIN `{$refTable}` ON `{$table}`.`{$column}` = `{$refTable}`.`id` " .
                    "SET `{$table}`.`{$tempCol}` = `{$refTable}`.`{$refUuidCol}`"
                );

                $this->dropIndexIfExists($table, $column);
                Schema::table($table, function (Blueprint $t) use ($column) {
                    $t->dropColumn($column);
                });

                Schema::table($table, function (Blueprint $t) use ($tempCol, $column) {
                    $t->renameColumn($tempCol, $column);
                });
            }
        }

        // ── STEP 4: Remove AUTO_INCREMENT + Drop old PKs ───────────────────
        foreach ($tables as $table => $uuidCol) {
            DB::statement("ALTER TABLE `{$table}` MODIFY COLUMN `id` BIGINT UNSIGNED NOT NULL");
            $hasPK = DB::select("SHOW KEYS FROM `{$table}` WHERE Key_name = 'PRIMARY'");
            if (!empty($hasPK)) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropPrimary();
                });
            }
        }

        // ── STEP 5: Drop old 'id' columns ──────────────────────────────────
        foreach ($tables as $table => $uuidCol) {
            if ($this->columnExists($table, 'id')) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropColumn('id');
                });
            }
        }

        // ── STEP 6: Set new PKs ────────────────────────────────────────────
        foreach ($tables as $table => $uuidCol) {
            $pkCheck = DB::select("SHOW KEYS FROM `{$table}` WHERE Key_name = 'PRIMARY'");
            if (empty($pkCheck)) {
                Schema::table($table, function (Blueprint $t) use ($uuidCol) {
                    $t->primary($uuidCol);
                });
            }
        }

        // ── STEP 7: Make UUID columns NOT NULL ─────────────────────────────
        foreach ($tables as $table => $uuidCol) {
            if ($this->isColumnNullable($table, $uuidCol)) {
                Schema::table($table, function (Blueprint $t) use ($uuidCol) {
                    $t->char($uuidCol, 36)->nullable(false)->change();
                });
            }
        }

        // ── STEP 8: Recreate foreign key constraints ───────────────────────
        foreach ($newFKConstraints as $fk) {
            $existingFK = DB::select(
                "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL",
                [$fk['table'], $fk['column']]
            );
            if (empty($existingFK)) {
                $onDelete = $fk['nullable'] ? 'SET NULL' : 'CASCADE';
                DB::statement(
                    "ALTER TABLE `{$fk['table']}` ADD CONSTRAINT `{$fk['table']}_{$fk['column']}_foreign` " .
                    "FOREIGN KEY (`{$fk['column']}`) REFERENCES `{$fk['ref_table']}` (`{$fk['ref_column']}`) ON DELETE {$onDelete}"
                );
            }
        }

        // ── STEP 9: Rename name columns ────────────────────────────────────
        if ($this->columnExists('users', 'name')) {
            Schema::table('users', function (Blueprint $t) {
                $t->renameColumn('name', 'user_name');
            });
        }
        if ($this->columnExists('products', 'name')) {
            Schema::table('products', function (Blueprint $t) {
                $t->renameColumn('name', 'product_name');
            });
        }
    }

    public function down(): void
    {
        $tables = $this->tables;

        // ── Reverse Step 9: Rename name columns back ───────────────────────
        if ($this->columnExists('products', 'product_name')) {
            Schema::table('products', function (Blueprint $t) {
                $t->renameColumn('product_name', 'name');
            });
        }
        if ($this->columnExists('users', 'user_name')) {
            Schema::table('users', function (Blueprint $t) {
                $t->renameColumn('user_name', 'name');
            });
        }

        // ── Reverse Step 8: Drop new FK constraints ────────────────────────
        foreach ($this->newFKConstraints as $fk) {
            $this->dropForeignKeyIfExists($fk['table'], $fk['column']);
        }

        // ── Reverse Step 6+5+4: Drop PKs, add back id, set PK ─────────────
        foreach ($tables as $table => $uuidCol) {
            $hasPK = DB::select("SHOW KEYS FROM `{$table}` WHERE Key_name = 'PRIMARY'");
            if (!empty($hasPK)) {
                Schema::table($table, function (Blueprint $t) {
                    $t->dropPrimary();
                });
            }
            Schema::table($table, function (Blueprint $t) use ($uuidCol) {
                $t->dropColumn($uuidCol);
                $t->id()->first();
            });
        }

        // ── Reverse Step 3: Convert FK columns back to integer ─────────────
        // (This is best-effort; old integer IDs are lost)
        // Skip FK restoration for down — too complex without backup data.

        // ── Restore old FK constraints (best-effort, won't work without old id values) ──
    }
};

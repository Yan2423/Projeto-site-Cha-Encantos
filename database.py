# database.py
import sqlite3
from datetime import datetime

class Database:
    def __init__(self, db_name='cha_encantos.db'):
        self.db_name = db_name
        self.init_db()

    def init_db(self):
        """Cria as tabelas necessárias"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS mensagens_contato (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                email TEXT NOT NULL,
                mensagem TEXT NOT NULL,
                status TEXT DEFAULT 'nao_lida',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                respondida_em TIMESTAMP
            )
        ''')

        
        conn.commit()
        conn.close()
        print("✅ Banco de dados inicializado com sucesso!")

    # ========== MENSAGENS DE CONTATO ==========

    def salvar_mensagem(self, nome, email, mensagem):
        """Salva uma mensagem do formulário de contato"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO mensagens_contato (nome, email, mensagem) VALUES (?, ?, ?)',
            (nome, email, mensagem)
        )
        conn.commit()
        novo_id = cursor.lastrowid
        conn.close()
        return novo_id

    def listar_mensagens(self, status=None, limit=50):
        """Lista todas as mensagens, opcionalmente filtrando por status"""
        conn = sqlite3.connect(self.db_name)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        if status:
            cursor.execute(
                'SELECT * FROM mensagens_contato WHERE status = ? ORDER BY created_at DESC LIMIT ?',
                (status, limit)
            )
        else:
            cursor.execute(
                'SELECT * FROM mensagens_contato ORDER BY created_at DESC LIMIT ?',
                (limit,)
            )

        resultados = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return resultados

    def marcar_como_lida(self, id):
        """Marca uma mensagem como lida"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE mensagens_contato SET status = 'lida', respondida_em = CURRENT_TIMESTAMP WHERE id = ?",
            (id,)
        )
        conn.commit()
        linhas_afetadas = cursor.rowcount
        conn.close()
        return linhas_afetadas > 0

    def deletar_mensagem(self, id):
        """Deleta uma mensagem"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM mensagens_contato WHERE id = ?', (id,))
        conn.commit()
        linhas_afetadas = cursor.rowcount
        conn.close()
        return linhas_afetadas > 0

    def get_estatisticas(self):
        """Retorna estatísticas das mensagens"""
        conn = sqlite3.connect(self.db_name)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM mensagens_contato')
        total = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM mensagens_contato WHERE status = 'nao_lida'")
        nao_lidas = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM mensagens_contato WHERE status = 'lida'")
        lidas = cursor.fetchone()[0]

        conn.close()
        return {'total': total, 'nao_lidas': nao_lidas, 'lidas': lidas}

    
# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from database import Database
import json

app = Flask(__name__)
CORS(app)  # Permite requisições do seu frontend

db = Database()

# ==================== ROTAS DA API ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({
        'status': 'online',
        'database': 'connected',
        'message': 'API Chá & Encantos funcionando!'
    })

@app.route('/api/contato', methods=['POST'])
def enviar_contato():
    """Endpoint para enviar mensagem do formulário de contato"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'success': False, 'error': 'Dados inválidos ou ausentes'}), 400

        if not data.get('nome') or not str(data['nome']).strip():
            return jsonify({'success': False, 'error': 'Nome é obrigatório'}), 400

        if not data.get('email') or not str(data['email']).strip():
            return jsonify({'success': False, 'error': 'Email é obrigatório'}), 400

        if not data.get('mensagem') or not str(data['mensagem']).strip():
            return jsonify({'success': False, 'error': 'Mensagem é obrigatória'}), 400

        novo_id = db.salvar_mensagem(
            nome=str(data['nome']).strip(),
            email=str(data['email']).strip(),
            mensagem=str(data['mensagem']).strip()
        )

        return jsonify({
            'success': True,
            'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'id': novo_id
        }), 201

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500






# ==================== ROTAS ADMINISTRATIVAS ====================

@app.route('/api/admin/mensagens', methods=['GET'])
def listar_mensagens_admin():
    """Lista todas as mensagens (para o painel admin)"""
    try:
        status = request.args.get('status')
        # Validar valor do status para evitar injeção
        if status and status not in ('lida', 'nao_lida'):
            return jsonify({'success': False, 'error': 'Status inválido'}), 400

        mensagens = db.listar_mensagens(status=status)
        return jsonify({'success': True, 'data': mensagens})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/admin/mensagens/<int:id>/marcar-lida', methods=['PUT'])
def marcar_mensagem_lida(id):
    """Marca uma mensagem como lida"""
    try:
        sucesso = db.marcar_como_lida(id)
        if sucesso:
            return jsonify({'success': True, 'message': 'Mensagem marcada como lida'})
        else:
            return jsonify({'success': False, 'error': 'Mensagem não encontrada'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/admin/mensagens/<int:id>', methods=['DELETE'])
def deletar_mensagem(id):
    """Deleta uma mensagem"""
    try:
        sucesso = db.deletar_mensagem(id)
        if sucesso:
            return jsonify({'success': True, 'message': 'Mensagem deletada com sucesso'})
        else:
            return jsonify({'success': False, 'error': 'Mensagem não encontrada'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/admin/estatisticas', methods=['GET'])
def get_estatisticas():
    """Retorna estatísticas das mensagens"""
    try:
        stats = db.get_estatisticas()
        return jsonify({'success': True, 'data': stats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500





# ==================== INICIALIZAR SERVIDOR ====================

if __name__ == '__main__':
    print("=" * 50)
    print("🍵 API Chá & Encantos")
    print("=" * 50)
    print(f"📁 Banco de dados: cha_encantos.db")
    print(f"🌐 API rodando em: http://localhost:5000")
    print(f"📋 Health check:   http://localhost:5000/api/health")
    print(f"👑 Painel Admin:   abra admin.html no navegador")
    print("=" * 50)
    print("Pressione CTRL+C para parar o servidor\n")

    app.run(debug=True, host='0.0.0.0', port=5000)

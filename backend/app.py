from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Database file (simple JSON storage for now)
DB_FILE = 'game_data.json'

def load_db():
    """Load game data from JSON file"""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    return {'players': {}, 'leaderboard': []}

def save_db(data):
    """Save game data to JSON file"""
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Aquifer Explorer backend is running!'})

@app.route('/api/player/<player_id>', methods=['GET'])
def get_player(player_id):
    """Get player data"""
    db = load_db()
    if player_id in db['players']:
        return jsonify({'success': True, 'data': db['players'][player_id]})
    return jsonify({'success': False, 'error': 'Player not found'}), 404

@app.route('/api/player/<player_id>', methods=['POST'])
def save_player(player_id):
    """Save player data"""
    db = load_db()
    data = request.json
    
    player_data = {
        'id': player_id,
        'avatar': data.get('avatar', '🧑'),
        'level': data.get('level', 1),
        'credits': data.get('credits', 0),
        'health': data.get('health', 100),
        'badges': data.get('badges', []),
        'playtime': data.get('playtime', 0),
        'lastUpdated': datetime.now().isoformat()
    }
    
    db['players'][player_id] = player_data
    save_db(db)
    
    return jsonify({'success': True, 'data': player_data})

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get top 10 players by credits"""
    db = load_db()
    sorted_players = sorted(
        db['players'].values(),
        key=lambda p: p['credits'],
        reverse=True
    )[:10]
    
    return jsonify({
        'success': True,
        'data': sorted_players
    })

@app.route('/api/leaderboard/level', methods=['GET'])
def get_level_leaderboard():
    """Get top 10 players by level reached"""
    db = load_db()
    sorted_players = sorted(
        db['players'].values(),
        key=lambda p: (p['level'], p['credits']),
        reverse=True
    )[:10]
    
    return jsonify({
        'success': True,
        'data': sorted_players
    })

@app.route('/api/badges', methods=['GET'])
def get_badges():
    """Get all available badges"""
    badges = {
        'speedrun': {'name': 'Speed Runner', 'icon': '⚡', 'description': 'Complete a level in under 1 minute'},
        'perfectWater': {'name': 'Perfect Flow', 'icon': '💧', 'description': 'Reach max water flow'},
        'noDamage': {'name': 'Unscathed', 'icon': '🛡️', 'description': 'Complete a level without taking damage'},
        'collector': {'name': 'Crystal Collector', 'icon': '💎', 'description': 'Collect 50 water crystals'},
        'deepDiver': {'name': 'Deep Diver', 'icon': '🌊', 'description': 'Reach level 10'},
        'survivor': {'name': 'Survivor', 'icon': '🏆', 'description': 'Reach level 5'},
    }
    
    return jsonify({'success': True, 'data': badges})

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall game statistics"""
    db = load_db()
    
    total_players = len(db['players'])
    total_credits = sum(p['credits'] for p in db['players'].values())
    max_level = max((p['level'] for p in db['players'].values()), default=1)
    
    return jsonify({
        'success': True,
        'data': {
            'totalPlayers': total_players,
            'totalCreditsEarned': total_credits,
            'highestLevelReached': max_level,
            'timestamp': datetime.now().isoformat()
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

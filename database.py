"""
Database models and utilities for user tracking and analytics
"""

import sqlite3
from datetime import datetime
import json
import os

DATABASE_PATH = 'app_data.db'


def get_db_connection():
    """Get database connection."""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    """Initialize database with required tables."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # User sessions table (simple tracking without full auth)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # User interactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_interactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            feature_type TEXT NOT NULL,
            action TEXT NOT NULL,
            data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
        )
    ''')

    # Favorites table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            item_type TEXT NOT NULL,
            item_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES user_sessions(session_id)
        )
    ''')

    # Analytics cache table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analytics_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cache_key TEXT UNIQUE NOT NULL,
            cache_data TEXT NOT NULL,
            expires_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")


def track_interaction(session_id, feature_type, action, data=None):
    """Track user interaction."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Ensure session exists
        cursor.execute(
            'INSERT OR IGNORE INTO user_sessions (session_id) VALUES (?)',
            (session_id,)
        )

        # Update last active
        cursor.execute(
            'UPDATE user_sessions SET last_active = ? WHERE session_id = ?',
            (datetime.now(), session_id)
        )

        # Track interaction
        cursor.execute('''
            INSERT INTO user_interactions
            (session_id, feature_type, action, data)
            VALUES (?, ?, ?, ?)
        ''', (
            session_id,
            feature_type,
            action,
            json.dumps(data) if data else None
        ))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error tracking interaction: {e}")
        return False


def get_user_history(session_id, limit=50):
    """Get user interaction history."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT feature_type, action, data, created_at
            FROM user_interactions
            WHERE session_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (session_id, limit))

        rows = cursor.fetchall()
        conn.close()

        history = []
        for row in rows:
            history.append({
                'feature_type': row['feature_type'],
                'action': row['action'],
                'data': json.loads(row['data']) if row['data'] else None,
                'created_at': row['created_at']
            })

        return history
    except Exception as e:
        print(f"Error getting history: {e}")
        return []


def add_favorite(session_id, item_type, item_data):
    """Add item to favorites."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO favorites (session_id, item_type, item_data)
            VALUES (?, ?, ?)
        ''', (session_id, item_type, json.dumps(item_data)))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error adding favorite: {e}")
        return False


def get_favorites(session_id):
    """Get user favorites."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, item_type, item_data, created_at
            FROM favorites
            WHERE session_id = ?
            ORDER BY created_at DESC
        ''', (session_id,))

        rows = cursor.fetchall()
        conn.close()

        favorites = []
        for row in rows:
            favorites.append({
                'id': row['id'],
                'item_type': row['item_type'],
                'item_data': json.loads(row['item_data']),
                'created_at': row['created_at']
            })

        return favorites
    except Exception as e:
        print(f"Error getting favorites: {e}")
        return []


def remove_favorite(session_id, favorite_id):
    """Remove item from favorites."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('''
            DELETE FROM favorites
            WHERE id = ? AND session_id = ?
        ''', (favorite_id, session_id))

        conn.commit()
        conn.close()
        return True
    except Exception as e:
        print(f"Error removing favorite: {e}")
        return False


def get_usage_analytics(session_id=None):
    """Get usage analytics and statistics."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if session_id:
            # User-specific analytics
            cursor.execute('''
                SELECT feature_type, COUNT(*) as count
                FROM user_interactions
                WHERE session_id = ?
                GROUP BY feature_type
                ORDER BY count DESC
            ''', (session_id,))
        else:
            # Global analytics
            cursor.execute('''
                SELECT feature_type, COUNT(*) as count
                FROM user_interactions
                GROUP BY feature_type
                ORDER BY count DESC
            ''')

        rows = cursor.fetchall()

        analytics = {}
        for row in rows:
            analytics[row['feature_type']] = row['count']

        # Get total sessions
        cursor.execute(
            'SELECT COUNT(DISTINCT session_id) as total '
            'FROM user_sessions'
        )
        total_sessions = cursor.fetchone()['total']

        # Get total interactions
        cursor.execute('SELECT COUNT(*) as total FROM user_interactions')
        total_interactions = cursor.fetchone()['total']

        conn.close()

        return {
            'feature_usage': analytics,
            'total_sessions': total_sessions,
            'total_interactions': total_interactions
        }
    except Exception as e:
        print(f"Error getting analytics: {e}")
        return {}


def get_recommendations(session_id):
    """Generate AI-powered recommendations based on user history."""
    try:
        history = get_user_history(session_id, limit=100)

        if not history:
            return {
                'recommended_features': [
                    'text-to-image',
                    'image-to-text',
                    'text-to-text'
                ],
                'message': 'Start exploring our AI features!'
            }

        # Count feature usage
        feature_counts = {}
        for item in history:
            feature = item['feature_type']
            feature_counts[feature] = feature_counts.get(feature, 0) + 1

        # Get most used features
        sorted_features = sorted(
            feature_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )

        most_used = sorted_features[0][0] if sorted_features else None

        # Generate smart recommendations
        recommendations = []

        # Complementary features
        feature_suggestions = {
            'text-to-image': [
                'image-enhance',
                'outpainting',
                'image-to-text'
            ],
            'image-to-text': [
                'text-to-image',
                'text-to-text',
                'image-enhance'
            ],
            'text-to-text': [
                'text-to-image',
                'image-to-text',
                'voice-to-text'
            ],
            'image-enhance': [
                'outpainting',
                'text-to-image',
                'image-to-text'
            ],
            'outpainting': [
                'image-enhance',
                'text-to-image',
                'image-to-text'
            ],
            'voice-to-text': [
                'text-to-text',
                'text-to-audio',
                'text-to-image'
            ],
            'text-to-audio': [
                'voice-to-text',
                'text-to-text',
                'text-to-image'
            ]
        }

        if most_used and most_used in feature_suggestions:
            recommendations = feature_suggestions[most_used][:3]
        else:
            recommendations = [
                'text-to-image',
                'image-enhance',
                'outpainting'
            ]

        # Generate insights
        total_actions = len(history)
        unique_features = len(feature_counts)

        insights = []
        if total_actions > 10:
            insights.append(
                f"You've performed {total_actions} actions!"
            )
        if unique_features >= 5:
            insights.append(
                f"You've explored {unique_features} different features!"
            )
        if most_used:
            feature_name = most_used.replace('-', ' ').title()
            insights.append(
                f"Your favorite feature is {feature_name}"
            )

        return {
            'recommended_features': recommendations,
            'insights': insights,
            'most_used_feature': most_used,
            'total_actions': total_actions,
            'unique_features': unique_features
        }
    except Exception as e:
        print(f"Error generating recommendations: {e}")
        return {
            'recommended_features': [
                'text-to-image',
                'image-to-text',
                'text-to-text'
            ],
            'message': 'Explore our AI features!'
        }


# Initialize database on module import
if not os.path.exists(DATABASE_PATH):
    init_database()

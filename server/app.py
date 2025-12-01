from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import json
import os

app = Flask(__name__)
CORS(app)

# --- 資料庫設定 (SQLite) ---
# 資料庫檔案會建立在 server 目錄下的 studyhub.db
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'studyhub.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- 資料模型 ---
# 為了保持彈性並盡量不更動前端結構，我們將所有使用者資料存為一個 JSON 欄位
class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # 儲存整個應用程式的狀態 (tasks, grades, timetable...)
    data_json = db.Column(db.Text, nullable=False) 

# 初始化資料庫
with app.app_context():
    db.create_all()

# --- LMStudio 設定 ---
LM_STUDIO_URL = "http://localhost:1234/v1/chat/completions"

@app.route('/')
def home():
    return "Study Hub Backend (with SQLite) is running!"

# --- 資料庫 API ---

@app.route('/api/data', methods=['GET'])
def get_data():
    """取得使用者資料"""
    try:
        # 假設單機版只有一個使用者，直接取第一筆
        record = UserData.query.first()
        if record:
            return jsonify(json.loads(record.data_json))
        else:
            # 如果沒有資料，回傳空物件，讓前端使用預設值
            return jsonify({}) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['POST'])
def save_data():
    """儲存使用者資料 (全量更新)"""
    try:
        new_data = request.json
        record = UserData.query.first()
        
        if record:
            record.data_json = json.dumps(new_data)
        else:
            new_record = UserData(data_json=json.dumps(new_data))
            db.session.add(new_record)
        
        db.session.commit()
        return jsonify({"status": "success", "message": "Data saved"})
    except Exception as e:
        print(f"Save Error: {e}")
        return jsonify({"error": str(e)}), 500

# --- AI API (維持原樣) ---

@app.route('/api/summary', methods=['POST'])
def generate_summary():
    try:
        data = request.json
        tasks = data.get('tasks', [])
        current_date = data.get('current_date', 'Unknown Date')
        
        task_desc = []
        for t in tasks:
            status = "已完成" if t.get('completed') else "未完成"
            cat_map = {'exam': '考試', 'report': '報告', 'cancel': '停課', 'other': '其他'}
            cat = cat_map.get(t.get('category'), '事項')
            task_desc.append(f"- {t['date']} [{cat}] {t['subject']}: {t['note']} ({status})")
        
        task_text = "\n".join(task_desc) if task_desc else "本週無行程"

        system_prompt = "你是一個大學生私人助理。請根據行程表，用繁體中文生成一段簡短的『本週摘要』(100字內)。語氣自然。優先提醒未完成的考試與報告。"
        user_prompt = f"今天是 {current_date}。行程：\n{task_text}"

        payload = {
            "model": "local-model",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 200,
            "stream": False
        }

        resp = requests.post(LM_STUDIO_URL, json=payload, headers={"Content-Type": "application/json"})
        
        if resp.status_code == 200:
            return jsonify({"summary": resp.json()['choices'][0]['message']['content']})
        else:
            return jsonify({"summary": f"AI 回應錯誤: {resp.status_code}"}), 500

    except requests.exceptions.ConnectionError:
        return jsonify({"summary": "⚠️ 無法連線到 LMStudio，請確認 Local Server (Port 1234) 已啟動。"}), 503
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"summary": f"伺服器錯誤: {str(e)}"}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """
    接收前端傳來的對話歷史 (messages)，轉發給 LMStudio
    """
    try:
        data = request.json
        messages = data.get('messages', [])
        
        payload = {
            "model": "local-model",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 800,
            "stream": False
        }

        resp = requests.post(
            LM_STUDIO_URL, 
            json=payload, 
            headers={"Content-Type": "application/json"}
        )
        
        if resp.status_code == 200:
            ai_response = resp.json()
            reply_content = ai_response['choices'][0]['message']['content']
            return jsonify({"reply": reply_content})
        else:
            error_msg = f"LM Studio Error: {resp.status_code} - {resp.text}"
            print(error_msg)
            return jsonify({"error": error_msg}), 500

    except requests.exceptions.ConnectionError:
        return jsonify({"error": "無法連線到 LMStudio，請確認 Local Server (Port 1234) 已啟動。"}), 503
    except Exception as e:
        print(f"Server Error: {e}")
        return jsonify({"error": f"伺服器內部錯誤: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


books = [
    {'id': 1, 'title': '1984', 'author': 'George Orwell'},
    {'id': 2, 'title': 'To Kill a Mockingbird', 'author': 'Harper Lee'}
]

@app.route('/books', methods=['GET'])
def get_books():
    return jsonify(books)

@app.route('/books/<int:id>', methods=['GET'])
def get_book(id):
    book = next((book for book in books if book['id'] == id), None)
    return jsonify(book)


@app.route('/webhook', methods=['POST'])
def handle_webhook():
    event = request.headers.get('X-GitHub-Event')
    payload = request.get_json()

    if event == 'pull_request':
        action = payload.get('action')
        pull_request = payload.get('pull_request')
        # Adicione aqui o que você quer fazer com o pull request
        print(f"Pull request {action}: {pull_request['title']}")

    elif event == 'issue_comment':
        action = payload.get('action')
        comment = payload.get('comment')
        issue = payload.get('issue')
        # Adicione aqui o que você quer fazer com o comentário
        print(f"Comentário {action} no pull request {issue['title']}: {comment['body']}")

    return jsonify({'status': 'success'}), 200


from flask import Flask, request, jsonify
from transformers import pipeline
import re

app = Flask(__name__)

# Load multilingual model that can handle Hebrew
classifier = pipeline(
    "text-classification",
    model="avichr/heBERT_sentiment_analysis",
    tokenizer="avichr/heBERT_sentiment_analysis"
)

def clean_text(text):
    # Remove URLs and special characters, keep Hebrew text
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = re.sub(r'[^\u0590-\u05FF\s]', ' ', text)
    return text.strip()

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        results = data.get('results', [])
        
        print("Received results from client:", results)  # Added print statement
        
        analyzed_results = []
        
        for result_group in results:
            keyword = result_group.get('keyword', '')
            search_results = result_group.get('results', [])
            
            for item in search_results:
                content = item.get('content', '')
                title = item.get('title', '')
                
                # Clean and prepare text
                clean_content = clean_text(content)
                clean_title = clean_text(title)
                
                if clean_content or clean_title:
                    # Analyze sentiment for both content and title
                    content_sentiment = classifier(clean_content) if clean_content else None
                    title_sentiment = classifier(clean_title) if clean_title else None
                    
                    # Calculate overall sentiment
                    is_negative = False
                    if content_sentiment and content_sentiment[0]['label'] == 'negative':
                        is_negative = True
                    if title_sentiment and title_sentiment[0]['label'] == 'negative':
                        is_negative = True
                        
                    analyzed_results.append({
                        'keyword': keyword,
                        'title': title,
                        'content': content,
                        'is_negative': is_negative,
                        'relevance_score': content_sentiment[0]['score'] if content_sentiment else 0
                    })
        
        return jsonify({
            'status': 'success',
            'analyzed_results': analyzed_results
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)

# from flask import Flask, request, jsonify
# from transformers import pipeline

# app = Flask(__name__)

# # Load the sentiment analysis model
# sentiment_pipeline = pipeline("sentiment-analysis", model="onlplab/alephbert-base")

# @app.route('/analyze', methods=['POST'])
# def analyze():
#     # Get snippets from the request body
#     data = request.json
#     snippets = data.get('snippets', [])
    
#     results = []
    
#     for snippet in snippets:
#         sentiment = sentiment_pipeline(snippet)
#         results.append({
#             'snippet': snippet,
#             'sentiment': sentiment[0]['label'],  # 'POSITIVE' or 'NEGATIVE'
#             'score': sentiment[0]['score']       # Confidence score
#         })

#     return jsonify(results)

# if __name__ == '__main__':
#     app.run(port=5000)  # Runs the server on port 5000

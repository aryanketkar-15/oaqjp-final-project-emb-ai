/**
 * mywebscript.js
 * Handles the front-end logic for the Emotion Detector application.
 * Sends the user's text to the Flask backend and renders the result.
 */

const EMOTION_ICONS = {
    joy: '😊',
    anger: '😠',
    sadness: '😢',
    fear: '😨',
    disgust: '🤢'
};

const EMOTION_COLORS = {
    joy: 'joy',
    anger: 'anger',
    sadness: 'sadness',
    fear: 'fear',
    disgust: 'disgust'
};

/**
 * Parses the Flask server response string into a structured object.
 * Expected format:
 * "For the given statement, the system response is 'anger': 0.1, ... The dominant emotion is <b>joy</b>."
 */
function parseResponse(responseText) {
    // Handle error case
    if (responseText.includes('Invalid text')) {
        return { error: true, message: responseText };
    }

    const emotions = ['anger', 'disgust', 'fear', 'joy', 'sadness'];
    const scores = {};

    emotions.forEach(emotion => {
        const regex = new RegExp(`'${emotion}':\\s*([0-9.]+)`);
        const match = responseText.match(regex);
        scores[emotion] = match ? parseFloat(match[1]) : 0;
    });

    const dominantMatch = responseText.match(/<b>(\w+)<\/b>/);
    const dominant = dominantMatch ? dominantMatch[1] : null;

    return { error: false, scores, dominant };
}

/**
 * Renders the emotion bars and dominant emotion badge.
 */
function renderResult(parsed) {
    const container = document.getElementById('resultContent');

    if (parsed.error) {
        container.innerHTML = `
            <div class="error-msg">
                ⚠️ ${parsed.message}
            </div>`;
        return;
    }

    const { scores, dominant } = parsed;
    const emotions = ['joy', 'anger', 'sadness', 'fear', 'disgust'];

    const barsHTML = emotions.map(emotion => {
        const score = scores[emotion] || 0;
        const pct = Math.round(score * 100);
        return `
            <div class="emotion-row">
                <span class="emotion-label">${EMOTION_ICONS[emotion]} ${emotion}</span>
                <div class="bar-track">
                    <div class="bar-fill bar-${emotion}" data-width="${pct}" style="width:0%"></div>
                </div>
                <span class="emotion-score">${(score * 100).toFixed(1)}%</span>
            </div>`;
    }).join('');

    const dominantClass = dominant ? `dominant-${dominant}` : 'dominant-error';
    const dominantIcon = dominant ? EMOTION_ICONS[dominant] : '❓';
    const dominantText = dominant || 'Unknown';

    container.innerHTML = `
        <div class="emotion-bars">${barsHTML}</div>
        <div class="dominant-section">
            <span class="dominant-label">Dominant Emotion:</span>
            <span class="dominant-badge ${dominantClass}">
                ${dominantIcon} ${dominantText}
            </span>
        </div>`;

    // Animate bars
    requestAnimationFrame(() => {
        document.querySelectorAll('.bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
    });
}

/**
 * Main function: sends text to /emotionDetector and renders result.
 */
async function RunSentimentAnalysis() {
    const textInput = document.getElementById('textToAnalyze').value.trim();
    const resultContainer = document.getElementById('resultContainer');
    const resultContent = document.getElementById('resultContent');
    const btn = document.getElementById('analyzeBtn');

    // Show loading
    resultContainer.style.display = 'block';
    resultContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            Analyzing emotions...
        </div>`;
    btn.disabled = true;
    btn.style.opacity = '0.6';

    try {
        const response = await fetch(`/emotionDetector?textToAnalyze=${encodeURIComponent(textInput)}`);
        const text = await response.text();
        const parsed = parseResponse(text);
        renderResult(parsed);
    } catch (err) {
        resultContent.innerHTML = `
            <div class="error-msg">
                ⚠️ Failed to connect to the server. Please try again.
            </div>`;
    } finally {
        btn.disabled = false;
        btn.style.opacity = '';
    }
}

// Allow Enter key (Ctrl+Enter) to submit
document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('textToAnalyze');
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            RunSentimentAnalysis();
        }
    });
});

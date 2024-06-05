document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    let drawing = false;
    let penSize = 1;
    let isEraser = false;
    let lastX = 0;
    let lastY = 0;

    // 状態管理
    const undoStack = [];
    const redoStack = [];

    // 初期キャンバスを白で塗りつぶす
    function fillWhite() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    fillWhite();

    function saveState(stack, keepRedo = false) {
        if (stack.length >= 20) { // 履歴を20ステップまでに制限
            stack.shift();
        }
        stack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (!keepRedo) {
            redoStack.length = 0; // redoスタックをクリア
        }
    }

    function restoreState(stack, saveToStack) {
        if (stack.length) {
            saveState(saveToStack, true); // 元の状態を別のスタックに保存
            const state = stack.pop();
            ctx.putImageData(state, 0, 0);
        }
    }

    function getCanvasCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        const x = Math.floor((clientX - rect.left) / rect.width * canvas.width);
        const y = Math.floor((clientY - rect.top) / rect.height * canvas.height);
        return { x, y };
    }

    function drawDot(x, y) {
        ctx.fillStyle = isEraser ? 'white' : 'black';
        ctx.fillRect(x, y, penSize, penSize);
    }

    function draw(e) {
        if (!drawing) return;
        e.preventDefault(); // タッチイベントのデフォルト動作を無効にする
        const { x, y } = getCanvasCoordinates(e);

        // ブレゼンハムの直線アルゴリズムを使用して、ドットを描画する
        let dx = Math.abs(x - lastX);
        let dy = Math.abs(y - lastY);
        let sx = lastX < x ? 1 : -1;
        let sy = lastY < y ? 1 : -1;
        let err = dx - dy;

        while (true) {
            drawDot(lastX, lastY);
            if (lastX === x && lastY === y) break;
            let e2 = err * 2;
            if (e2 > -dy) {
                err -= dy;
                lastX += sx;
            }
            if (e2 < dx) {
                err += dx;
                lastY += sy;
            }
        }
    }

    canvas.addEventListener('mousedown', (e) => {
        saveState(undoStack);
        drawing = true;
        const coords = getCanvasCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
        draw(e);
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mouseout', () => drawing = false);

    // タッチイベントを追加
    canvas.addEventListener('touchstart', (e) => {
        saveState(undoStack);
        drawing = true;
        const coords = getCanvasCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
        draw(e);
    });

    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', () => drawing = false);
    canvas.addEventListener('touchcancel', () => drawing = false);

    document.getElementById('penSize').addEventListener('input', (e) => {
        penSize = e.target.value;
    });

    document.getElementById('eraser').addEventListener('click', () => {
        isEraser = !isEraser;
        document.getElementById('eraser').textContent = isEraser ? 'ペンに切り替え' : '消しゴム';
    });

    document.getElementById('undo').addEventListener('click', () => {
        restoreState(undoStack, redoStack);
    });

    document.getElementById('redo').addEventListener('click', () => {
        restoreState(redoStack, undoStack);
    });

    document.getElementById('clear').addEventListener('click', () => {
        saveState(undoStack);
        fillWhite();
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const binaryData = [];

        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const isBlack = r === 0 && g === 0 && b === 0;
            binaryData.push(isBlack ? 1 : 0);
        }

        const json = JSON.stringify(binaryData);
        document.getElementById('output').textContent = json;
    });
});

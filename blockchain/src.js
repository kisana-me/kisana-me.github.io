class Block {
    constructor(index, previousHash, data) {
        this.index = index;
        this.timestamp = new Date().toISOString();
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = null; // Initialize hash as null
    }

    async init() {
        this.hash = await this.calculateHash();
    }

    async calculateHash() {
        const text = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        const uint8  = new TextEncoder().encode(text);
        const digest = await crypto.subtle.digest('SHA-256', uint8);
        return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('');
    }
}

class Blockchain {
    constructor(difficulty = 4) {
        this.chain = [];
        this.difficulty = difficulty;
    }

    async init() {
        const genesisBlock = await this.createGenesisBlock();
        this.chain.push(genesisBlock);
    }

    async createGenesisBlock() {
        const genesisBlock = new Block(0, "0", "Genesis Block");
        await genesisBlock.init();
        return genesisBlock;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== await currentBlock.calculateHash()) {
                return { valid: false, block: currentBlock };
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return { valid: false, block: currentBlock };
            }
        }
        return { valid: true, block: null };
    }
}

const ui = {
    blockchain: null,
    miningAbortController: null,

    init(blockchain) {
        this.blockchain = blockchain;
        this.render();
        document.getElementById('level').value = this.blockchain.difficulty;
        document.getElementById('level').addEventListener('change', (e) => {
            this.blockchain.difficulty = parseInt(e.target.value, 10);
        });
    },

    render() {
        const container = document.querySelector('.container');
        container.innerHTML = '';
        this.blockchain.chain.forEach((block, index) => {
            const blockDiv = this.createBlockElement(block, index);
            container.appendChild(blockDiv);
        });
        this.updateChainState();
    },

    createBlockElement(block, index) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'block';
        blockDiv.id = `block-${index}`;
        blockDiv.innerHTML = `
            <input type="number" value="${block.index}" placeholder="Number番号" disabled>
            <input type="number" value="${block.nonce}" placeholder="Nonceナンス" disabled>
            <textarea placeholder="Data情報">${block.data}</textarea>
            <input type="text" value="${block.previousHash}" placeholder="Previous前" disabled>
            <input type="text" value="${block.hash || ''}" placeholder="Hashハッシュ" disabled>
            <button class="mine-button">AutoMine自動採掘</button>
            <button class="fork-button">ここから分岐</button>
            <details>
                <summary>詳細</summary>
                <p>Timestamp: ${block.timestamp}</p>
            </details>
        `;

        blockDiv.querySelector('textarea').addEventListener('input', async (e) => {
            this.blockchain.chain[index].data = e.target.value;
            // Recalculate hash for the current block when data changes
            this.blockchain.chain[index].hash = await this.blockchain.chain[index].calculateHash();
            this.render(); // Re-render to show the new hash and validity status
        });

        blockDiv.querySelector('.mine-button').addEventListener('click', () => this.mine(index));
        blockDiv.querySelector('.fork-button').addEventListener('click', () => this.fork(index));

        return blockDiv;
    },

    async mine(fromIndex) {
        const mineButton = document.querySelector(`#block-${fromIndex} .mine-button`);
        const loadingIndicator = this.showLoading(mineButton);
        
        this.miningAbortController = new AbortController();
        const signal = this.miningAbortController.signal;

        try {
            const newBlock = new Block(fromIndex + 1, this.blockchain.chain[fromIndex].hash, "New Block Data");
            await newBlock.init(); // Initialize the new block
            
            const target = Array(this.blockchain.difficulty + 1).join("0");
            
            const mineLoop = async () => {
                while (newBlock.hash.substring(0, this.blockchain.difficulty) !== target) {
                    if (signal.aborted) {
                        throw new DOMException('Aborted', 'AbortError');
                    }
                    newBlock.nonce++;
                    newBlock.hash = await newBlock.calculateHash();
                    // Optional: Update UI during mining to show progress
                    // document.querySelector(`#block-${fromIndex + 1} input[placeholder="Nonceナンス"]`).value = newBlock.nonce;
                    // document.querySelector(`#block-${fromIndex + 1} input[placeholder="Hashハッシュ"]`).value = newBlock.hash;
                }
            };

            await mineLoop();

            this.blockchain.chain = this.blockchain.chain.slice(0, fromIndex + 1);
            this.blockchain.chain.push(newBlock);
            this.render();

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Mining was canceled.');
                this.render(); // Re-render to remove the canceled block
            } else {
                console.error('An error occurred during mining:', error);
            }
        } finally {
            this.hideLoading(mineButton, loadingIndicator);
            this.miningAbortController = null;
        }
    },

    async fork(fromIndex) {
        const newBlock = new Block(this.blockchain.chain[fromIndex].index + 1, this.blockchain.chain[fromIndex].hash, "Forked Block Data");
        await newBlock.init();
        this.blockchain.chain.push(newBlock);
        this.render();
    },

    async updateChainState() {
        const { valid, block: invalidBlock } = await this.blockchain.isChainValid();
        this.blockchain.chain.forEach((block, index) => {
            const blockDiv = document.getElementById(`block-${index}`);
            if (blockDiv) {
                if (invalidBlock && block.index >= invalidBlock.index) {
                    blockDiv.style.backgroundColor = 'rgb(255, 100, 100)';
                } else {
                    blockDiv.style.backgroundColor = 'rgb(137, 119, 138)';
                }
            }
        });
    },

    showLoading(button) {
        button.disabled = true;
        const nowCulc = document.createElement('div');
        nowCulc.className = 'nowCulc';
        button.parentNode.insertBefore(nowCulc, button.nextSibling);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'キャンセル';
        cancelButton.className = 'cancel-button';
        cancelButton.onclick = () => {
            if (this.miningAbortController) {
                this.miningAbortController.abort();
            }
        };
        nowCulc.parentNode.insertBefore(cancelButton, nowCulc.nextSibling);
        
        return { nowCulc, cancelButton };
    },

    hideLoading(button, { nowCulc, cancelButton }) {
        button.disabled = false;
        if (nowCulc && nowCulc.parentNode) {
            nowCulc.parentNode.removeChild(nowCulc);
        }
        if (cancelButton && cancelButton.parentNode) {
            cancelButton.parentNode.removeChild(cancelButton);
        }
    }
};

window.onload = async () => {
    const myBlockchain = new Blockchain();
    await myBlockchain.init();
    ui.init(myBlockchain);
};

const player = document.getElementById('player');
const level = document.getElementById('level-layout');

// إحداثيات البداية: x=10 (فوق المنصة الوسطى)، y=0 ليبدأ السقوط عليها
let playerPos = { x: 70, y: 2 }; 
let velocityY = 0;
let isJumping = true; 

const gravity = 0.5;
const jumpPower = -10;
const moveSpeed = 0.7; 
const keys = {};

let dynamicSpikeX = 40; // النسبة المئوية الابتدائية (left: 45%)
let hasMoved = false;

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function checkSpikeCollision() {
    const spikes = document.querySelectorAll('.spike-group');
    const playerRect = player.getBoundingClientRect();

    spikes.forEach(spikeGroup => {
        const spikeRect = spikeGroup.getBoundingClientRect();

        if (
            playerRect.left < spikeRect.right &&
            playerRect.right > spikeRect.left &&
            playerRect.top < spikeRect.bottom &&
            playerRect.bottom > spikeRect.top
        ) {
            resetGame();
        }
    });
}

function resetGame() {
    playerPos = { x: 70, y: 2 }; 
    velocityY = 0;
    isJumping = true;

    isSpikeMoving = false;
    dynamicSpikeX = 40; 
    const dynamicSpike = document.querySelector('.dynamic-spike');
    if (dynamicSpike) dynamicSpike.style.left = "40%";
    console.log("Game Over! Restarting...");
}

function handleDynamicSpikes() {
    const dynamicSpike = document.querySelector('.dynamic-spike');
    if (!dynamicSpike || hasMoved) return;

    // الحصول على إحداثيات اللاعب والمسامير بالبكسل بالنسبة للشاشة
    const spikeRect = dynamicSpike.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // حساب نقطة المنتصف عمودياً (Y) للمسامير
    const spikeMidY = spikeRect.top + (spikeRect.height / 2);
    
    // حساب نقطة المنتصف عمودياً (Y) للاعب
    const playerMidY = playerRect.top + (playerRect.height / 2);

    // الشرط: إذا أصبح منتصف اللاعب مساوياً أو أكبر (أوطى) من منتصف المسامير
    if (playerMidY >= spikeMidY) {
        // تنفيذ الحركة
        dynamicSpikeX -= 2; 
        dynamicSpike.style.left = dynamicSpikeX + "%";
        
        hasMoved = true; // التأكد أنها تتحرك مرة واحدة فقط
        console.log("تم تفعيل الحركة عند وصول المنتصف!");
    }
}

function update() {
    const w = level.clientWidth;
    const h = level.clientHeight;

    // حساب أبعاد اللاعب بالنسبة المئوية
    const pW = (player.offsetWidth / w) * 100;
    const pH = (player.offsetHeight / h) * 100;

    // 1. الحركة الأفقية
    if (keys['ArrowLeft'] || keys['KeyA']) playerPos.x -= moveSpeed;
    if (keys['ArrowRight'] || keys['KeyD']) playerPos.x += moveSpeed;

    // 2. القفز والجاذبية
    if ((keys['Space'] || keys['ArrowUp']) && !isJumping) {
        velocityY = jumpPower;
        isJumping = true;
    }
    velocityY += gravity;
    playerPos.y += velocityY * 0.2; 


    checkSpikeCollision();
    handleDynamicSpikes();
    // --- 3. منطق التصادم (Collision Logic) ---

    // المستوى الأول: المنصة الوسطى (تظهر في الرسمة من 0% حتى 90%)
    // الارتفاع عند 50%
    const middleY = 30 - pH;
    
    // اللاعب يتصادم مع المنصة الوسطى فقط إذا كان عرضياً داخل حدودها (أقل من 90%)
    if (playerPos.x <= 90 - (pW / 2)) {
        if (playerPos.y >= middleY && velocityY >= 0 && playerPos.y <= middleY + 5) {
            playerPos.y = middleY;
            velocityY = 0;
            isJumping = false;
        }
    }

    // المستوى الثاني: الأرضية الأساسية (Main Ground)
    // الارتفاع عند 100%
    const groundY = 100 - pH;
    
    if (playerPos.y >= groundY) {
        playerPos.y = groundY;
        velocityY = 0;
        isJumping = false;
    }

    // 4. منع الخروج من الشاشة يميناً ويساراً
    if (playerPos.x < 0) playerPos.x = 0;
    if (playerPos.x > 100 - pW) playerPos.x = 100 - pW;

    // 5. تحديث الموقع
    player.style.left = playerPos.x + "%";
    player.style.top = playerPos.y + "%";

    requestAnimationFrame(update);
}

update();
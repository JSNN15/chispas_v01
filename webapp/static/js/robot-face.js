/**
 * Chispas Robot Face - Animación de cara del robot
 * Dibuja y anima la cara del robot con múltiples expresiones
 */

class RobotFace {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.expression = 'happy';
        this.previousExpression = 'happy';
        this.blinkTimer = 0;
        this.isBlinking = false;
        this.animationFrame = 0;

        // Nuevas propiedades para animaciones
        this.headTilt = 0;
        this.headBounce = 0;
        this.earWiggle = 0;
        this.expressionTransition = 1; // 0 a 1 para transiciones suaves
        this.eyeLookX = 0;
        this.eyeLookY = 0;
        this.breathePhase = 0;

        // Configuración de tamaños responsivos
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Iniciar animación
        this.animate();
    }

    resize() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth - 40, 600);
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.scale = size / 600; // Escala basada en el tamaño original de 600px
    }

    setExpression(expression) {
        if (this.expression !== expression) {
            this.previousExpression = this.expression;
            this.expression = expression;
            this.expressionTransition = 0; // Iniciar transición

            // Animaciones especiales al cambiar expresión
            this.headBounce = 20 * this.scale;

            // Movimientos específicos por expresión
            switch (expression) {
                case 'curious':
                    this.headTilt = 15;
                    break;
                case 'surprised':
                    this.headBounce = 30 * this.scale;
                    break;
                case 'excited':
                    this.headBounce = 40 * this.scale;
                    break;
                case 'sad':
                    this.headTilt = -5;
                    break;
                default:
                    this.headTilt = 0;
            }
        }
    }

    // Dibujar la cara completa
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Fondo con gradiente
        this.drawBackground();

        // Guardar estado del canvas
        this.ctx.save();

        // Aplicar transformaciones para animaciones
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate((this.headTilt * Math.PI) / 180);
        this.ctx.translate(0, -this.headBounce + Math.sin(this.breathePhase) * 3 * this.scale);
        this.ctx.translate(-this.centerX, -this.centerY);

        // Componentes de la cara
        this.drawHead();
        this.drawEars();
        this.drawEyes();
        this.drawNose();
        this.drawMouth();
        this.drawWhiskers();
        this.drawDecorations();

        // Restaurar estado del canvas
        this.ctx.restore();

        // Efectos especiales según expresión (sin transformaciones)
        this.drawSpecialEffects();
    }

    drawBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, this.canvas.width * 0.6
        );
        gradient.addColorStop(0, '#FFE5EC');
        gradient.addColorStop(1, '#FFC8DD');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawHead() {
        const headSize = 200 * this.scale;
        const headRadius = 80 * this.scale;

        // Sombra
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        this.ctx.shadowBlur = 20 * this.scale;
        this.ctx.shadowOffsetY = 10 * this.scale;

        // Cabeza principal
        this.ctx.fillStyle = '#FFFFFF';
        this.roundRect(
            this.centerX - headSize / 2,
            this.centerY - headSize / 2,
            headSize,
            headSize,
            headRadius
        );

        // Resetear sombra
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;

        // Mejillas (si está feliz o enamorado)
        if (this.expression === 'happy' || this.expression === 'loving' || this.expression === 'excited') {
            this.ctx.fillStyle = 'rgba(255, 182, 193, 0.4)';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - 80 * this.scale, this.centerY + 20 * this.scale, 30 * this.scale, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.centerX + 80 * this.scale, this.centerY + 20 * this.scale, 30 * this.scale, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawEars() {
        const earSize = 60 * this.scale;

        // Animación de orejas (se mueven cuando está curioso o emocionado)
        let leftEarAngle = 0;
        let rightEarAngle = 0;
        if (this.expression === 'curious' || this.expression === 'excited') {
            leftEarAngle = Math.sin(this.animationFrame * 0.1) * 10;
            rightEarAngle = Math.sin(this.animationFrame * 0.1 + Math.PI) * 10;
        } else if (this.expression === 'sad') {
            leftEarAngle = -15;
            rightEarAngle = -15;
        }

        this.ctx.fillStyle = '#2C3E50';

        // Oreja izquierda con rotación
        this.ctx.save();
        this.ctx.translate(this.centerX - 75 * this.scale, this.centerY - 100 * this.scale);
        this.ctx.rotate((leftEarAngle * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.moveTo(-25 * this.scale, 0);
        this.ctx.lineTo(25 * this.scale, 0);
        this.ctx.lineTo(0, -50 * this.scale);
        this.ctx.closePath();
        this.ctx.fill();

        // Detalle interno oreja izquierda
        this.ctx.fillStyle = '#FF6B9D';
        this.ctx.beginPath();
        this.ctx.moveTo(-15 * this.scale, -5 * this.scale);
        this.ctx.lineTo(10 * this.scale, -5 * this.scale);
        this.ctx.lineTo(0, -30 * this.scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

        // Oreja derecha con rotación
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.save();
        this.ctx.translate(this.centerX + 75 * this.scale, this.centerY - 100 * this.scale);
        this.ctx.rotate((rightEarAngle * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.moveTo(25 * this.scale, 0);
        this.ctx.lineTo(-25 * this.scale, 0);
        this.ctx.lineTo(0, -50 * this.scale);
        this.ctx.closePath();
        this.ctx.fill();

        // Detalle interno oreja derecha
        this.ctx.fillStyle = '#FF6B9D';
        this.ctx.beginPath();
        this.ctx.moveTo(15 * this.scale, -5 * this.scale);
        this.ctx.lineTo(-10 * this.scale, -5 * this.scale);
        this.ctx.lineTo(0, -30 * this.scale);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawEyes() {
        const leftEyeX = this.centerX - 50 * this.scale;
        const rightEyeX = this.centerX + 50 * this.scale;
        const eyeY = this.centerY - 30 * this.scale;

        switch (this.expression) {
            case 'happy':
            case 'excited':
                this.drawHappyEyes(leftEyeX, rightEyeX, eyeY);
                break;
            case 'surprised':
                this.drawSurprisedEyes(leftEyeX, rightEyeX, eyeY);
                break;
            case 'sad':
                this.drawSadEyes(leftEyeX, rightEyeX, eyeY);
                break;
            case 'loving':
                this.drawLovingEyes(leftEyeX, rightEyeX, eyeY);
                break;
            case 'sleepy':
                this.drawSleepyEyes(leftEyeX, rightEyeX, eyeY);
                break;
            case 'curious':
                this.drawCuriousEyes(leftEyeX, rightEyeX, eyeY);
                break;
            default:
                this.drawNeutralEyes(leftEyeX, rightEyeX, eyeY);
        }
    }

    drawHappyEyes(leftX, rightX, y) {
        const eyeSize = 35 * this.scale;

        // Ojos cerrados en línea curva (sonriendo)
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 5 * this.scale;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.arc(leftX, y, eyeSize * 0.7, 0.2, Math.PI - 0.2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(rightX, y, eyeSize * 0.7, 0.2, Math.PI - 0.2);
        this.ctx.stroke();

        // Destellos
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(leftX - 10 * this.scale, y - 5 * this.scale, 3 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX + 10 * this.scale, y - 5 * this.scale, 3 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSurprisedEyes(leftX, rightX, y) {
        const eyeSize = 45 * this.scale;

        // Ojos muy abiertos
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 6 * this.scale;
        this.ctx.beginPath();
        this.ctx.arc(leftX, y, eyeSize, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(rightX, y, eyeSize, 0, Math.PI * 2);
        this.ctx.stroke();

        // Pupilas grandes
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.beginPath();
        this.ctx.arc(leftX, y, eyeSize * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX, y, eyeSize * 0.6, 0, Math.PI * 2);
        this.ctx.fill();

        // Brillos
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(leftX - 10 * this.scale, y - 10 * this.scale, 8 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX - 10 * this.scale, y - 10 * this.scale, 8 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawSadEyes(leftX, rightX, y) {
        const eyeSize = 30 * this.scale;

        // Ojos normales
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.beginPath();
        this.ctx.arc(leftX, y, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX, y, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();

        // Cejas tristes
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 4 * this.scale;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(leftX - 35 * this.scale, y - 40 * this.scale);
        this.ctx.lineTo(leftX + 25 * this.scale, y - 50 * this.scale);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(rightX + 35 * this.scale, y - 40 * this.scale);
        this.ctx.lineTo(rightX - 25 * this.scale, y - 50 * this.scale);
        this.ctx.stroke();

        // Lágrimas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.beginPath();
        this.ctx.ellipse(leftX - 5 * this.scale, y + 45 * this.scale, 5 * this.scale, 8 * this.scale, 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawLovingEyes(leftX, rightX, y) {
        const heartSize = 25 * this.scale;

        // Corazones como ojos
        this.ctx.fillStyle = '#FF69B4';
        this.drawHeart(leftX, y, heartSize);
        this.drawHeart(rightX, y, heartSize);
    }

    drawSleepyEyes(leftX, rightX, y) {
        // Ojos cerrados
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 5 * this.scale;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
        this.ctx.moveTo(leftX - 30 * this.scale, y);
        this.ctx.lineTo(leftX + 30 * this.scale, y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(rightX - 30 * this.scale, y);
        this.ctx.lineTo(rightX + 30 * this.scale, y);
        this.ctx.stroke();

        // Zzz
        this.ctx.fillStyle = '#9B59B6';
        this.ctx.font = `${30 * this.scale}px Fredoka, sans-serif`;
        this.ctx.fillText('Z', rightX + 50 * this.scale, y - 30 * this.scale);
        this.ctx.font = `${20 * this.scale}px Fredoka, sans-serif`;
        this.ctx.fillText('z', rightX + 70 * this.scale, y - 50 * this.scale);
        this.ctx.font = `${15 * this.scale}px Fredoka, sans-serif`;
        this.ctx.fillText('z', rightX + 80 * this.scale, y - 65 * this.scale);
    }

    drawCuriousEyes(leftX, rightX, y) {
        const eyeSize = 35 * this.scale;

        // Ojo izquierdo normal
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.beginPath();
        this.ctx.arc(leftX, y, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();

        // Ojo derecho más grande (curioso)
        this.ctx.beginPath();
        this.ctx.arc(rightX, y - 5 * this.scale, eyeSize * 1.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Brillos
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(leftX - 10 * this.scale, y - 10 * this.scale, 8 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX - 12 * this.scale, y - 15 * this.scale, 10 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();

        // Ceja levantada
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 4 * this.scale;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.moveTo(rightX - 40 * this.scale, y - 50 * this.scale);
        this.ctx.lineTo(rightX + 30 * this.scale, y - 60 * this.scale);
        this.ctx.stroke();
    }

    drawNeutralEyes(leftX, rightX, y) {
        const eyeSize = 35 * this.scale;

        // Ojos normales con movimiento sutil
        this.ctx.fillStyle = '#2C3E50';
        this.ctx.beginPath();
        this.ctx.arc(leftX + this.eyeLookX, y + this.eyeLookY, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX + this.eyeLookX, y + this.eyeLookY, eyeSize, 0, Math.PI * 2);
        this.ctx.fill();

        // Brillos que siguen la mirada
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(leftX + this.eyeLookX - 10 * this.scale, y + this.eyeLookY - 10 * this.scale, 10 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX + this.eyeLookX - 10 * this.scale, y + this.eyeLookY - 10 * this.scale, 10 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();

        // Brillos secundarios
        this.ctx.beginPath();
        this.ctx.arc(leftX + this.eyeLookX + 8 * this.scale, y + this.eyeLookY + 8 * this.scale, 5 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(rightX + this.eyeLookX + 8 * this.scale, y + this.eyeLookY + 8 * this.scale, 5 * this.scale, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawNose() {
        const noseY = this.centerY + 10 * this.scale;

        this.ctx.fillStyle = '#FF6B9D';
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, noseY - 10 * this.scale);
        this.ctx.lineTo(this.centerX - 12 * this.scale, noseY + 10 * this.scale);
        this.ctx.lineTo(this.centerX + 12 * this.scale, noseY + 10 * this.scale);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawMouth() {
        const mouthY = this.centerY + 40 * this.scale;

        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 5 * this.scale;
        this.ctx.lineCap = 'round';

        switch (this.expression) {
            case 'happy':
            case 'excited':
                // Sonrisa grande
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY, 50 * this.scale, 0.3, Math.PI - 0.3);
                this.ctx.stroke();
                break;
            case 'surprised':
                // Boca O
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY + 10 * this.scale, 25 * this.scale, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            case 'sad':
                // Boca triste
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY + 40 * this.scale, 50 * this.scale, Math.PI + 0.3, Math.PI * 2 - 0.3);
                this.ctx.stroke();
                break;
            case 'loving':
                // Sonrisa dulce con corazón
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY, 40 * this.scale, 0.4, Math.PI - 0.4);
                this.ctx.stroke();
                this.drawHeart(this.centerX + 60 * this.scale, mouthY - 10 * this.scale, 15 * this.scale);
                break;
            case 'sleepy':
                // Boca pequeña dormida
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY, 20 * this.scale, 0, Math.PI);
                this.ctx.stroke();
                break;
            default:
                // Sonrisa neutral
                this.ctx.beginPath();
                this.ctx.arc(this.centerX, mouthY, 40 * this.scale, 0.4, Math.PI - 0.4);
                this.ctx.stroke();
        }
    }

    drawWhiskers() {
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 3 * this.scale;
        this.ctx.lineCap = 'round';

        const whiskerY1 = this.centerY + 10 * this.scale;
        const whiskerY2 = this.centerY + 30 * this.scale;
        const whiskerY3 = this.centerY + 50 * this.scale;

        // Bigotes izquierdos
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 80 * this.scale, whiskerY1);
        this.ctx.lineTo(this.centerX - 130 * this.scale, whiskerY1 - 10 * this.scale);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 80 * this.scale, whiskerY2);
        this.ctx.lineTo(this.centerX - 140 * this.scale, whiskerY2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - 80 * this.scale, whiskerY3);
        this.ctx.lineTo(this.centerX - 130 * this.scale, whiskerY3 + 10 * this.scale);
        this.ctx.stroke();

        // Bigotes derechos
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 80 * this.scale, whiskerY1);
        this.ctx.lineTo(this.centerX + 130 * this.scale, whiskerY1 - 10 * this.scale);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 80 * this.scale, whiskerY2);
        this.ctx.lineTo(this.centerX + 140 * this.scale, whiskerY2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + 80 * this.scale, whiskerY3);
        this.ctx.lineTo(this.centerX + 130 * this.scale, whiskerY3 + 10 * this.scale);
        this.ctx.stroke();
    }

    drawDecorations() {
        // Estrellitas decorativas cuando está emocionado
        if (this.expression === 'excited' || this.expression === 'happy') {
            this.ctx.fillStyle = '#FFD700';
            this.drawStar(this.centerX - 130 * this.scale, this.centerY - 80 * this.scale, 5, 10 * this.scale, 5 * this.scale);
            this.drawStar(this.centerX + 130 * this.scale, this.centerY - 80 * this.scale, 5, 10 * this.scale, 5 * this.scale);
        }
    }

    drawSpecialEffects() {
        switch (this.expression) {
            case 'excited':
                // Partículas de colores girando
                for (let i = 0; i < 5; i++) {
                    const angle = (this.animationFrame * 0.02 + i * Math.PI * 2 / 5) % (Math.PI * 2);
                    const radius = 150 * this.scale;
                    const x = this.centerX + Math.cos(angle) * radius;
                    const y = this.centerY + Math.sin(angle) * radius;

                    this.ctx.fillStyle = `hsla(${i * 72}, 100%, 70%, 0.6)`;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 8 * this.scale, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                break;

            case 'happy':
                // Estrellas brillantes intermitentes
                for (let i = 0; i < 3; i++) {
                    const opacity = (Math.sin(this.animationFrame * 0.05 + i) + 1) / 2;
                    this.ctx.fillStyle = `rgba(255, 215, 0, ${opacity * 0.8})`;
                    const x = this.centerX + (i - 1) * 100 * this.scale;
                    const y = this.centerY - 140 * this.scale;
                    this.drawStar(x, y, 5, 12 * this.scale, 6 * this.scale);
                }
                break;

            case 'loving':
                // Corazones flotantes
                for (let i = 0; i < 4; i++) {
                    const yOffset = ((this.animationFrame * 2 + i * 30) % 150) * this.scale;
                    const x = this.centerX + (i % 2 === 0 ? -1 : 1) * (80 + (i % 2) * 40) * this.scale;
                    const y = this.centerY + 120 * this.scale - yOffset;
                    const opacity = 1 - (yOffset / (150 * this.scale));

                    this.ctx.fillStyle = `rgba(255, 105, 180, ${opacity * 0.6})`;
                    this.drawHeart(x, y, 15 * this.scale);
                }
                break;

            case 'curious':
                // Signos de interrogación flotando
                this.ctx.fillStyle = '#9B59B6';
                this.ctx.font = `${40 * this.scale}px Fredoka, sans-serif`;
                const questionY = this.centerY - 120 * this.scale + Math.sin(this.animationFrame * 0.05) * 10 * this.scale;
                this.ctx.fillText('?', this.centerX + 100 * this.scale, questionY);
                break;

            case 'surprised':
                // Rayos de sorpresa
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 4 * this.scale;
                this.ctx.lineCap = 'round';
                for (let i = 0; i < 8; i++) {
                    const angle = (i * Math.PI * 2) / 8 + this.animationFrame * 0.02;
                    const startR = 140 * this.scale;
                    const endR = 160 * this.scale + Math.sin(this.animationFrame * 0.1 + i) * 10 * this.scale;
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        this.centerX + Math.cos(angle) * startR,
                        this.centerY + Math.sin(angle) * startR
                    );
                    this.ctx.lineTo(
                        this.centerX + Math.cos(angle) * endR,
                        this.centerY + Math.sin(angle) * endR
                    );
                    this.ctx.stroke();
                }
                break;

            case 'sleepy':
                // Burbujas de sueño adicionales
                const bubbleY = this.centerY - Math.sin(this.animationFrame * 0.03) * 30 * this.scale;
                this.ctx.strokeStyle = 'rgba(155, 89, 182, 0.5)';
                this.ctx.lineWidth = 2 * this.scale;
                this.ctx.beginPath();
                this.ctx.arc(this.centerX + 120 * this.scale, bubbleY, 20 * this.scale, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
        }
    }

    // Función auxiliar para dibujar rectángulos redondeados
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Función auxiliar para dibujar corazones
    drawHeart(x, y, size) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.beginPath();
        this.ctx.moveTo(0, size * 0.3);
        this.ctx.bezierCurveTo(-size, -size * 0.3, -size, size * 0.8, 0, size);
        this.ctx.bezierCurveTo(size, size * 0.8, size, -size * 0.3, 0, size * 0.3);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    // Función auxiliar para dibujar estrellas
    drawStar(x, y, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let cx = x + Math.cos(rot) * outerRadius;
            let cy = y + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(cx, cy);
            rot += step;

            cx = x + Math.cos(rot) * innerRadius;
            cy = y + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(cx, cy);
            rot += step;
        }

        this.ctx.lineTo(x, y - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Loop de animación
    animate() {
        this.animationFrame++;

        // Parpadeo aleatorio
        if (Math.random() < 0.02 && !this.isBlinking) {
            this.isBlinking = true;
            setTimeout(() => {
                this.isBlinking = false;
            }, 200);
        }

        // Actualizar fase de respiración (efecto sutil de respirar)
        this.breathePhase += 0.02;

        // Reducir bounce gradualmente
        if (this.headBounce > 0) {
            this.headBounce *= 0.9;
            if (this.headBounce < 0.1) this.headBounce = 0;
        }

        // Suavizar tilt hacia el objetivo
        const targetTilt = this.expression === 'curious' ? 15 :
                          this.expression === 'sad' ? -5 : 0;
        this.headTilt += (targetTilt - this.headTilt) * 0.1;

        // Movimiento sutil de ojos (mirar alrededor ocasionalmente)
        if (this.expression === 'happy' || this.expression === 'neutral' || this.expression === 'curious') {
            // Movimiento muy sutil de ojos
            if (Math.random() < 0.005) {
                this.eyeLookX = (Math.random() - 0.5) * 8 * this.scale;
                this.eyeLookY = (Math.random() - 0.5) * 8 * this.scale;
            }
            // Suavizar movimiento de ojos hacia el objetivo
            this.eyeLookX *= 0.95;
            this.eyeLookY *= 0.95;
        } else {
            this.eyeLookX *= 0.9;
            this.eyeLookY *= 0.9;
        }

        // Transición suave entre expresiones
        if (this.expressionTransition < 1) {
            this.expressionTransition += 0.05;
            if (this.expressionTransition > 1) this.expressionTransition = 1;
        }

        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

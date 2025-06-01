// composables/useCardToBoardAnimation.ts
import { sleep } from '@/utils';
import { Card } from '@shared/Card';
import { nextTick, ref } from 'vue';
import gsap from 'gsap';

const isAnimatin = ref(false);

export function useAnimator() {


    async function animateCardToBoard(card: Card): Promise<void> {
        if (document.getElementById('clone-' + card.instanceId)) return;

        const handEl = document.querySelector(`[data-id="${card.instanceId}"]`) as HTMLElement;
        if (!handEl || isAnimatin.value) return;

        isAnimatin.value = true;

        // ✅ Clone immediately — before Vue removes it
        const handRect = handEl.getBoundingClientRect();
        const clone = handEl.cloneNode(true) as HTMLElement;

        // Clean up class names and transition stuff
        [handEl, clone].forEach(domEl => {
            domEl.className = domEl.className
                .split(' ')
                .filter(c => !c.startsWith('card-slide') && !c.startsWith('v-'))
                .join(' ');
            domEl.removeAttribute('data-v-*');
        });

        handEl.style.opacity = '0'; // Hide the original

        clone.id = 'clone-' + card.instanceId;
        clone.style.position = 'absolute';
        clone.style.left = `${handRect.left}px`;
        clone.style.top = `${handRect.top}px`;
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transition = 'all 400ms ease';
        clone.style.transform = '';

        if (!card.isActive) {
            clone.style.filter = 'grayscale(100%) contrast(75%)';
        }

        // ✅ Wait until the board DOM is updated
        await nextTick();

        const boardEl = document.querySelector(`.my-board-card[data-id="${card.instanceId}"]`) as HTMLElement;
        if (!boardEl) {
            handEl.style.opacity = ''; // Fallback
            clone.remove();
            isAnimatin.value = false;
            return;
        }

        const boardRect = boardEl.getBoundingClientRect();
        boardEl.style.opacity = '0'; // Hide destination card for a moment

        document.body.appendChild(clone);

        // Trigger animation
        requestAnimationFrame(() => {
            clone.style.left = `${boardRect.left}px`;
            clone.style.top = `${boardRect.top}px`;
        });

        return new Promise((resolve) => {
            setTimeout(async () => {
                await sleep(0.1);
                clone.remove();
                boardEl.style.opacity = '';
                isAnimatin.value = false;
                resolve();
            }, 450);
        });
    }

    async function animateAttack(attacker: Card, defender: Card | 'base'): Promise<void> {
        const attackerEl = document.querySelector<HTMLElement>(`[id="${attacker.instanceId}"]`);
        if (!attackerEl) return;

        const targetSelector = defender === 'base'
            ? '.base.enemy'
            : `[id="${(defender as Card).instanceId}"]`;

        const targetEl = document.querySelector<HTMLElement>(targetSelector);
        if (!targetEl) return;

        const attackerRect = attackerEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const dx = targetRect.left + targetRect.width / 2 - (attackerRect.left + attackerRect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (attackerRect.top + attackerRect.height / 2);

        return new Promise<void>((resolve) => {
            const timeline = gsap.timeline({
                onComplete: () => {
                    gsap.delayedCall(0.2, resolve); // slight pause before resolving
                }
            });

            // Pre-attack wind-up
            timeline.to(attackerEl, {
                scale: 1.1,
                duration: 0.1,
                ease: 'power1.inOut',
            });

            // Dash to target
            timeline.to(attackerEl, {
                x: dx + (defender === 'base' ? 350 : 0),
                y: dy + (defender === 'base' ? -120 : 0),
                scale: 0.95,
                duration: 0.3,
                ease: 'power4.out',
                onStart: () => {
                    animateDefenderHit(targetEl); // Defender reacts during impact
                }
            });

            // Return to original position
            timeline.to(attackerEl, {
                x: 0,
                y: 0,
                scale: 1,
                duration: 0.2,
                ease: 'back.out(1.7)',
            });
        });
    }

    function animateDefenderHit(el: HTMLElement) {
        const shakeDistance = 16;
        const shakeTimes = 6;
        const shakeDuration = 0.08;

        const originalTransform = el.style.transform || '';

        const timeline = gsap.timeline();

        // Scale punch
        timeline.to(el, {
            scale: 1.1,
            duration: 0.08,
            ease: 'power1.out',
        });
        timeline.to(el, {
            scale: 1,
            duration: 0.08,
            ease: 'power1.in',
        });

        // Shake left-right
        for (let i = 0; i < shakeTimes; i++) {
            const x = i % 2 === 0 ? -shakeDistance : shakeDistance;
            timeline.to(el, {
                x,
                duration: shakeDuration,
                ease: 'none',
            });
        }

        // Restore original transform (removes residual shift)
        timeline.set(el, {
            x: 0,
            transform: originalTransform,
        });

        // Red flash
        gsap.fromTo(el, {
            boxShadow: '0 0 0px red',
        }, {
            boxShadow: '0 0 16px red',
            duration: 0.15,
            yoyo: true,
            repeat: 1,
        });
    }

    async function animateCardEffectActivation(cardId: string): Promise<void> {
        const cardEl = document.querySelector<HTMLElement>(`[id="${cardId}"]`);
        if (!cardEl) return;

        // Optional: Add visual effect overlay (aura/glow burst)
        const aura = document.createElement('div');
        aura.classList.add('card-activation-aura');
        cardEl.appendChild(aura);

        return new Promise(resolve => {
            const tl = gsap.timeline({
                onComplete: () => {
                    aura.remove();
                    resolve();
                }
            });

            // Step 1: Brief pause to draw attention
            tl.to(cardEl, {
                scale: 1.1,
                duration: 0.1,
                ease: 'power1.out'
            });

            // Step 2: Glow intensifies
            tl.to(cardEl, {
                boxShadow: '0 0 40px gold',
                scale: 1.15,
                duration: 0.25,
                ease: 'power2.out',
            });

            // Step 3: Small shake or pulse
            tl.to(cardEl, {
                x: "-=5",
                duration: 0.05,
                repeat: 3,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Step 4: Reset and fade glow
            tl.to(cardEl, {
                boxShadow: '0 0 0px transparent',
                scale: 1,
                duration: 0.2,
                ease: 'power2.inOut',
            });
        });
    }







    return { animateCardToBoard, animateAttack, animateCardEffectActivation, animateDefenderHit };
}

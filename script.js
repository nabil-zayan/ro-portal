// --- SOUND ENGINE (Web Audio API) ---
// Bikin suara langsung dari kode, nggak butuh file mp3!
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Browser zaman now butuh izin user buat nyalain suara, jadi kita pancing pas klik pertama
document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchstart', initAudio, { once: true });

const SoundFX = {
    pop: () => {
        if(!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    },
    boing: () => {
        if(!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(300, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start(); osc.stop(audioCtx.currentTime + 0.5);
    },
    swoosh: () => {
        if(!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start(); osc.stop(audioCtx.currentTime + 0.4);
    }
};

// Pasang suara pop ke semua tombol dan link
document.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a')) {
        initAudio();
        SoundFX.pop();
    }
});


// --- INIT UI & ICONS ---
lucide.createIcons();

// Data Management
let taskData = [
    { id: 1, title: "Tugas 1: Optimasi Biaya Pupuk (Metode Grafik)", date: "02 Mei 2026", status: "submitted", fileUrl: "https://drive.google.com/drive/folders/1kn13Bzs3Y6EAWAD2E-dw5c7AzMOnm2Sb?usp=sharing", description: "Menghitung kombinasi biaya minimum pembelian pupuk Standard dan Super untuk lahan petani pakai metode grafik." },
    { id: 2, title: "Tugas 2: Maksimasi Laba (Metode Grafik)", date: "02 Mar 2026", status: "submitted", fileUrl: "https://docs.google.com/spreadsheets/d/1mjrFThmFeZwUACeUqx6XnsnrRGwt7e66/edit?usp=sharing&ouid=100885773930294086459&rtpof=true&sd=true", description: "Nyari kombinasi jumlah tas Dora dan Spongebob yang harus diproduksi biar untung pabrik mentok maksimal, pakai metode grafik" },
    { id: 3, title: "Tugas 3: Metode Simpleks", date: "30 Apr 2026", status: "submitted", fileUrl: "https://drive.google.com/file/d/127ulY6Rytdn8TAr1njOVXuHL1C82HMQV/view?usp=sharing", description: "Penyelesaian masalah optimasi yang variabelnya banyak pakai iterasi tabel. Soalnya kalau variabelnya lebih dari dua udah pusing nggak bisa digambar di grafik wkwk." },
    { id: 4, title: "Tugas 4: Transportasi Reset Oprasi", date: "30 Apr 2026", status: "submitted", fileUrl: "https://docs.google.com/spreadsheets/d/1QJ5hn_WmHTYepf-raNvCWR4qeBaW26qy/edit?usp=sharing&ouid=100885773930294086459&rtpof=true&sd=true", description: "Nyari rute pengiriman barang paling hemat pakai metode NWC dan Biaya Terkecil." },
    { id: 5, title: "Tugas 5: Coming soon", date: "TBA", status: "locked", fileUrl: "#", description: "Coming soon." }
];

let currentFilter = 'all';
let searchQuery = '';

// --- EFEK NGETIK LOOPING (TYPEWRITER) ---
function startTypewriter() {
    const el = document.getElementById('typewriter-text');
    if (!el) return;
    el.innerHTML = '';
    
    const textArray = [
        "Halo, <br> Saya <span class='text-[#0a84ff]'>Zayann.</span>",
        "Disini Tempat Ngumpulin <br> Tugas <span class='text-[#0a84ff]'>Riset Operasi.</span>",
        "Pantau Progres <br> Belajar <span class='text-[#0a84ff]'>Makin Gampang.</span>"
    ];
    
    let arrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentHTML = "";

    function type() {
        const currentText = textArray[arrayIndex];

        if (isDeleting) {
            if (currentHTML.endsWith('>')) {
                const lastTagOpen = currentHTML.lastIndexOf('<');
                currentHTML = currentHTML.substring(0, lastTagOpen);
                charIndex = lastTagOpen;
            } else {
                currentHTML = currentText.substring(0, charIndex - 1);
                charIndex--;
            }
            
            el.innerHTML = currentHTML;

            if (charIndex > 0) {
                setTimeout(type, 30); 
            } else {
                isDeleting = false;
                arrayIndex = (arrayIndex + 1) % textArray.length; 
                setTimeout(type, 500); 
            }
        } else {
            if (charIndex < currentText.length) {
                if (currentText.charAt(charIndex) === '<') {
                    const tagCloseIndex = currentText.indexOf('>', charIndex);
                    currentHTML += currentText.substring(charIndex, tagCloseIndex + 1);
                    charIndex = tagCloseIndex + 1;
                } else {
                    currentHTML += currentText.charAt(charIndex);
                    charIndex++;
                }
                
                el.innerHTML = currentHTML;
                setTimeout(type, 50); 
            } else {
                isDeleting = true;
                setTimeout(type, 2500); 
            }
        }
    }
    setTimeout(type, 1000); 
}

// --- SCROLL REVEAL OBSERVER ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            entry.target.classList.remove('is-visible'); 
        }
    });
}, observerOptions);

function observeElements() {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
}

// --- UPDATE UI TUGAS ---
function updateStats() {
    const submitted = taskData.filter(t => t.status === 'submitted').length;
    const pending = taskData.filter(t => t.status === 'pending').length;
    const totalTasks = taskData.length - 1; 
    const percentage = Math.round((submitted / totalTasks) * 100); 

    const ps = document.getElementById('profile-stats');
    if(ps) ps.innerHTML = `<div class="glass-card flex flex-col items-center p-6"><span class="text-[#a1a1a6] text-xs font-bold uppercase tracking-wider mb-2">Matakuliah</span><span class="font-extrabold text-lg text-white">Riset Operasi</span></div><div class="glass-card flex flex-col items-center p-6"><span class="text-[#a1a1a6] text-xs font-bold uppercase tracking-wider mb-2">Selesai</span><span class="font-black text-3xl text-white">${submitted}</span></div><div class="glass-card flex flex-col items-center p-6"><span class="text-[#a1a1a6] text-xs font-bold uppercase tracking-wider mb-2">Belum</span><span class="font-black text-3xl text-[#a1a1a6]">${pending}</span></div>`;

    const pw = document.getElementById('progress-widget');
    if(pw) pw.innerHTML = `<div class="absolute -right-10 -top-10 w-40 h-40 bg-[#0a84ff]/5 rounded-full blur-3xl"></div><div class="w-full md:w-1/4 text-center md:text-left relative z-10"><p class="text-[#a1a1a6] text-sm font-semibold mb-1">Progres</p><h3 class="text-4xl font-extrabold text-white tracking-tight">${percentage}%</h3></div><div class="w-full md:w-3/4 flex flex-col gap-3 relative z-10"><div class="flex justify-between text-sm font-semibold text-[#a1a1a6]"><span>${submitted} Selesai</span><span>${pending} Belum</span></div><div class="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"><div class="h-full bg-[#0a84ff] rounded-full transition-all duration-1000" style="width: ${percentage}%;"></div></div></div>`;
}

function filterAndRenderTasks() {
    let filtered = taskData;
    if (currentFilter !== 'all') filtered = filtered.filter(task => task.status === currentFilter || (currentFilter === 'pending' && task.status === 'locked')); 
    if (searchQuery.trim() !== '') filtered = filtered.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    renderTasks(filtered);
}

function updateActiveFilterUI() {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active-filter', 'text-white');
        b.classList.add('text-[#a1a1a6]');
    });
    const activeBtn = document.getElementById(`filter-${currentFilter}`);
    if(activeBtn) {
        activeBtn.classList.add('active-filter', 'text-white');
        activeBtn.classList.remove('text-[#a1a1a6]');
    }
}

function setFilter(t) {
    currentFilter = t;
    updateActiveFilterUI();
    filterAndRenderTasks();
}
window.setFilter = setFilter;

function handleSearch(v) { 
    searchQuery = v; 
    filterAndRenderTasks(); 
}
window.handleSearch = handleSearch;

function renderTasks(ts = taskData) {
    const container = document.getElementById('task-container');
    if(!container) return;
    container.innerHTML = '';
    
    if (ts.length === 0) {
        container.innerHTML = `<div class="text-center p-10"><p class="text-[#a1a1a6]">Wah, tugasnya nggak ketemu nih. Coba cari kata kunci lain aja ya.</p></div>`;
        return;
    }
    
    ts.forEach((t, i) => {
        const s = t.status === 'submitted' ? `<span class="px-3 py-1 text-xs font-bold rounded-full bg-[#32d74b]/10 text-[#32d74b]">Selesai</span>` : t.status === 'pending' ? `<span class="px-3 py-1 text-xs font-bold rounded-full bg-[#ff9f0a]/10 text-[#ff9f0a]">Belum</span>` : `<span class="px-3 py-1 text-xs font-bold rounded-full bg-white/5 text-[#a1a1a6]">Terkunci</span>`;
        const b = t.status === 'submitted' ? `<a href="${t.fileUrl}" target="_blank" class="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition">Lihat</a><a href="${t.fileUrl}" download class="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition">Unduh</a>` : `<button class="px-5 py-2 rounded-full bg-white/5 text-[#a1a1a6] text-sm font-bold cursor-not-allowed border border-white/5">Proses</button>`;
        
        container.innerHTML += `<div class="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up" style="animation-delay: ${i*0.05}s"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><i data-lucide="file-text" class="w-5 h-5 text-white"></i></div><div><h3 class="text-base font-bold text-white mb-1">${t.title}</h3><p class="text-sm font-medium text-[#a1a1a6]">Mulai: ${t.date}</p></div></div><div class="flex items-center gap-4">${s}<div class="flex gap-2"><button onclick="openInfoModal(${t.id})" class="p-2.5 rounded-full bg-white/5 text-[#a1a1a6] hover:text-white hover:bg-white/10 transition"><i data-lucide="info" class="w-4 h-4"></i></button>${b}</div></div></div>`;
    });
    lucide.createIcons();
}

// --- MODAL & TOAST ---
function openInfoModal(id) {
    const t = taskData.find(x => x.id === id);
    if(!t) return;
    document.getElementById('modal-info-title').innerText = t.title;
    document.getElementById('modal-info-desc').innerText = t.description;
    document.getElementById('info-modal').classList.add('modal-active');
    setTimeout(() => document.getElementById('info-content').classList.add('modal-show'), 10);
}
window.openInfoModal = openInfoModal;

function closeInfoModal() {
    const infoContent = document.getElementById('info-content');
    const infoModal = document.getElementById('info-modal');
    if(infoContent && infoModal) {
        infoContent.classList.remove('modal-show');
        setTimeout(() => infoModal.classList.remove('modal-active'), 300);
    }
}
window.closeInfoModal = closeInfoModal;

function copyLink() {
    const u = window.location.href;
    const t = document.createElement("textarea"); t.value = u; document.body.appendChild(t); t.select();
    document.execCommand('copy'); document.body.removeChild(t);
    const toast = document.getElementById('toast'); 
    if(toast) {
        toast.classList.add('toast-show');
        setTimeout(() => toast.classList.remove('toast-show'), 3000);
    }
}
window.copyLink = copyLink;

// --- MENU MOBILE ---
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}
window.toggleMobileMenu = toggleMobileMenu;


// --- PHYSICS ENGINE ID CARD ---
let isDragging = false;
let cardTargetX = 0, cardTargetY = 0;
let currentX = 0, currentY = 0;
let velX = 0, velY = 0;
let cpX = 0, cpY = 0;
let cpVelX = 0, cpVelY = 0;
let startX = 0, startY = 0;

const tension = 0.045;   
const friction = 0.95;   
const ropeTension = 0.35;
const ropeFriction = 0.7;

function triggerProfileFall() {
    const idCard = document.getElementById('interactive-card');
    if(!idCard) return;
    
    idCard.classList.remove('id-card-swing');
    currentY = -1200; 
    currentX = 0;
    velX = 0;
    velY = 15; 
    cpX = 0;
    cpY = -600; 
    cpVelX = 0; cpVelY = 0;
    
    idCard.style.visibility = 'visible';
    idCard.style.transform = `translateY(${currentY}px)`;
    
    // Panggil efek suara swoosh!
    setTimeout(() => { SoundFX.swoosh(); }, 100);
}

function physicsLoop() {
    const idCard = document.getElementById('interactive-card');
    const lanyardPath = document.getElementById('lanyard-path');
    const lanyardGlow = document.getElementById('lanyard-path-glow');
    const lanyardGrad = document.getElementById('lanyard-grad');

    if(!idCard) return;

    if (isDragging) {
        currentX += (cardTargetX - currentX) * 0.5;
        currentY += (cardTargetY - currentY) * 0.5;
        velX = (cardTargetX - currentX);
        velY = (cardTargetY - currentY);
    } else {
        const ax = -currentX * tension;
        const ay = -currentY * tension;
        velX += ax; velY += ay;
        velX *= friction; velY *= friction;
        currentX += velX; currentY += velY;
    }

    const targetCpX = currentX / 2.5;
    const targetCpY = currentY / 2.5;
    const cpAx = (targetCpX - cpX) * ropeTension;
    const cpAy = (targetCpY - cpY) * ropeTension;
    cpVelX += cpAx; cpVelY += cpAy;
    cpVelX *= ropeFriction; cpVelY *= ropeFriction;
    cpX += cpVelX; cpY += cpVelY;

    const rotY = Math.max(-45, Math.min(45, (currentX * 0.08) + (velX * 0.8)));
    const rotX = Math.max(-45, Math.min(45, (currentY * -0.08) + (velY * -0.8)));
    const rotZ = Math.max(-20, Math.min(20, currentX * -0.03));
    const speed = Math.sqrt(velX*velX + velY*velY);
    const scale = 1 + Math.min(0.05, speed * 0.0005);
    
    idCard.style.transform = `translate(${currentX}px, ${currentY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
    
    if(lanyardPath && lanyardGlow) {
        const d = `M 500 0 Q ${500 + cpX} ${750 + cpY} ${500 + currentX} ${1500 + currentY}`;
        lanyardPath.setAttribute('d', d);
        lanyardGlow.setAttribute('d', d);
        if(lanyardGrad) {
            lanyardGrad.setAttribute('x2', (500 + currentX).toString());
            lanyardGrad.setAttribute('y2', (1500 + currentY).toString());
        }
    }

    requestAnimationFrame(physicsLoop);
}

// --- INIT SEMUA FITUR PAS HTML UDAH KELOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Icon
    lucide.createIcons();

    // 2. Pasang Event Listener Tombol Mobile
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }

    // 3. Tentukan halaman yang aktif sekarang
    const path = window.location.pathname;
    let page = 'home';
    if (path.endsWith('profile.html')) page = 'profile';
    else if (path.endsWith('tugas.html')) page = 'tugas';

    const navHome = document.getElementById('nav-home');
    const navProfile = document.getElementById('nav-profile');
    const navTasks = document.getElementById('nav-tasks');

    const setActive = (el) => {
        if(el) {
            el.classList.add('text-white', 'bg-white/15');
            el.classList.remove('text-[#a1a1a6]');
        }
    };

    // 4. Jalankan script sesuai halaman
    if (page === 'profile') {
        setActive(navProfile);
        triggerProfileFall();
        updateStats();
        physicsLoop(); // Nyalain loop fisika
        
        // Pasang Interaksi Mouse/Sentuh buat ID Card
        const idCard = document.getElementById('interactive-card');
        if(idCard) {
            idCard.addEventListener('mousedown', (e) => {
                if(e.target.closest('a')) return;
                initAudio();
                SoundFX.pop(); // Bunyi klik pas dipegang
                isDragging = true;
                idCard.classList.remove('id-card-swing');
                startX = e.clientX - currentX;
                startY = e.clientY - currentY;
            });
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                cardTargetX = e.clientX - startX;
                cardTargetY = e.clientY - startY;
            });
            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    SoundFX.boing(); // Bunyi membal pas dilepas
                }
            });
            
            idCard.addEventListener('touchstart', (e) => {
                if(e.target.closest('a')) return;
                initAudio();
                SoundFX.pop(); // Bunyi klik
                isDragging = true;
                idCard.classList.remove('id-card-swing');
                startX = e.touches[0].clientX - currentX;
                startY = e.touches[0].clientY - currentY;
            }, {passive: true});
            window.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                cardTargetX = e.touches[0].clientX - startX;
                cardTargetY = e.touches[0].clientY - startY;
            }, {passive: false});
            window.addEventListener('touchend', () => {
                if (isDragging) {
                    isDragging = false;
                    SoundFX.boing(); // Bunyi membal
                }
            });
        }
    } 
    else if (page === 'tugas') {
        setActive(navTasks);
        updateStats();
        updateActiveFilterUI();
        filterAndRenderTasks();
    } 
    else {
        // Halaman Home
        setActive(navHome);
        startTypewriter(); 
    }
    
    // 5. Nyalain animasi scroll
    observeElements();
});

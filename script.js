 
    (function() {
      // ---------- mobile navbar ----------
      const hamburger = document.getElementById('hamburgerBtn');
      const navMenu = document.getElementById('navMenu');
      if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
        document.querySelectorAll('.nav-menu a').forEach(link => {
          link.addEventListener('click', () => navMenu.classList.remove('active'));
        });
      }

      // ---------- HERO SLIDESHOW ----------
      let slideIndex = 0;
      const slides = document.querySelectorAll('.slide');
      const dotsContainer = document.getElementById('slideDots');
      const prevBtn = document.getElementById('prevSlide');
      const nextBtn = document.getElementById('nextSlide');
      let slideInterval;

      function createDots() {
        if (!dotsContainer) return;
        let html = '';
        slides.forEach((_, i) => {
          html += `<span class="dot-slide ${i === 0 ? 'active-dot' : ''}" data-slide="${i}"></span>`;
        });
        dotsContainer.innerHTML = html;
        document.querySelectorAll('.dot-slide').forEach(dot => {
          dot.addEventListener('click', (e) => {
            const idx = parseInt(e.target.dataset.slide, 10);
            showSlide(idx);
            resetTimer();
          });
        });
      }

      function showSlide(n) {
        if (!slides.length) return;
        slideIndex = (n + slides.length) % slides.length;
        slides.forEach((s, i) => {
          s.classList.toggle('active-slide', i === slideIndex);
        });
        const dots = document.querySelectorAll('.dot-slide');
        dots.forEach((d, i) => d.classList.toggle('active-dot', i === slideIndex));
      }

      function nextSlide() { showSlide(slideIndex + 1); resetTimer(); }
      function prevSlide() { showSlide(slideIndex - 1); resetTimer(); }

      function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5500);
      }

      if (slides.length) {
        createDots();
        showSlide(0);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        resetTimer();
      }

      // ---------- TESTIMONIAL slider (parents) ----------
      const testimonials = [
        { text: "My daughter joined Riverside in 6th grade, shy and unsure. Within a year she was on the debate team and loving school. The teachers truly care.", name: "Nadia Hassan", img: "https://images.pexels.com/users/avatars/1234567/testimonial-1.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2" },
        { text: "The STEM program is outstanding. My son built a robot that got into city finals! Small classes mean individual attention.", name: "Carlos Mendez", img: "https://images.pexels.com/users/avatars/1234568/testimonial-2.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2" },
        { text: "As an alum, I can say Riverside shaped my critical thinking. Now my kids go there – same warmth, but with amazing new facilities.", name: "Priya Sharma", img: "https://images.pexels.com/users/avatars/1234569/testimonial-3.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2" }
      ];

      const sliderContainer = document.getElementById('testimonialSlider');
      const dotsTesti = document.getElementById('testiDots');
      let tIndex = 0;
      let tInterval;

      function renderTestimonials(index) {
        if (!sliderContainer) return;
        const arr = testimonials;
        const ordered = [arr[index], arr[(index+1)%arr.length], arr[(index+2)%arr.length]];
        let html = '';
        ordered.forEach(t => {
          html += `<div class="testi-item"><i class="fas fa-quote-left"></i><p>${t.text}</p><div class="patient"><img src="${t.img}" alt="${t.name}"><h4>${t.name}</h4></div></div>`;
        });
        sliderContainer.innerHTML = html;
        let d = '';
        for (let i=0; i<arr.length; i++) d += `<span class="dot ${i===index?'active':''}" data-index="${i}"></span>`;
        dotsTesti.innerHTML = d;
        document.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', (e) => {
          tIndex = parseInt(e.target.dataset.index,10);
          renderTestimonials(tIndex);
          resetTestiAuto();
        }));
      }

      function nextTesti() { tIndex = (tIndex+1)%testimonials.length; renderTestimonials(tIndex); }
      function resetTestiAuto() { clearInterval(tInterval); tInterval = setInterval(nextTesti, 6000); }

      if (sliderContainer) { renderTestimonials(0); resetTestiAuto(); }

      // ---------- contact (whatsapp) ----------
      const contactBtn = document.getElementById('submitContact');
      if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const name = document.getElementById('name')?.value.trim() || '';
          const phone = document.getElementById('phone')?.value.trim() || '';
          const msg = document.getElementById('message')?.value.trim() || '';
          const feedback = document.getElementById('formFeedback');
          const schoolPhone = '15125550173';  // school contact
          if (!name || !msg) {
            feedback.textContent = '⚠️ Please enter name and message.';
            return;
          }
          let smsBody = `Inquiry from ${name}`;
          if (phone) smsBody += `, phone: ${phone}`;
          smsBody += `, message: ${msg}`;
          window.location.href = `sms:${schoolPhone}?body=${encodeURIComponent(smsBody)}`;
          feedback.textContent = '✅ Opening SMS app …';
        });
      }

      // smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#') return;
          const target = document.querySelector(href);
          if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
      });
    })();
  


    (function() {
      // Gallery modal functionality
      const items = document.querySelectorAll('.gallery-item');
      const modal = document.getElementById('galleryModal');
      const modalImg = document.getElementById('modalImage');
      const modalCaption = document.getElementById('modalCaption');
      const closeModal = document.querySelector('.close-modal');
      const prevBtn = document.querySelector('.modal-prev');
      const nextBtn = document.querySelector('.modal-next');

      if (!modal || !modalImg || !closeModal) return;

      let currentIndex = 0;
      const galleryImages = [];
      const captions = [];

      // collect data from gallery items
      items.forEach((item, idx) => {
        const img = item.querySelector('img');
        const overlaySpan = item.querySelector('.overlay span');
        if (img) {
          galleryImages.push(img.src);
          captions.push(overlaySpan ? overlaySpan.innerText : 'Royal Mentors');
        }

        // open modal when item clicked
        item.addEventListener('click', () => {
          currentIndex = idx;
          showModalImage(currentIndex);
          modal.style.display = 'flex';
        });
      });

      function showModalImage(index) {
        if (!modalImg || !modalCaption) return;
        modalImg.src = galleryImages[index];
        modalCaption.innerText = captions[index];
      }

      // close modal
      closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });

      // click outside image to close (on background)
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });

      // previous / next
      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
          showModalImage(currentIndex);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentIndex = (currentIndex + 1) % galleryImages.length;
          showModalImage(currentIndex);
        });
      }

      // keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'flex') return;
        if (e.key === 'Escape') {
          modal.style.display = 'none';
        } else if (e.key === 'ArrowLeft') {
          currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
          showModalImage(currentIndex);
        } else if (e.key === 'ArrowRight') {
          currentIndex = (currentIndex + 1) % galleryImages.length;
          showModalImage(currentIndex);
        }
      });
    })();


    (function() {
      // WhatsApp button functionality: opens WhatsApp with prepopulated message
      const contactBtn = document.getElementById('submitContact');
      if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
          e.preventDefault();

          const name = document.getElementById('name')?.value.trim() || '';
          const phone = document.getElementById('phone')?.value.trim() || '';
          const message = document.getElementById('message')?.value.trim() || '';
          const feedback = document.getElementById('formFeedback');

          // Validate required fields
          if (!name || !message) {
            feedback.textContent = '⚠️ Please enter your name and a message.';
            return;
          }

          // School WhatsApp number (with country code, no plus or spaces)
          const schoolWhatsApp = '918877490641';   // 88774 90641 with India code

          // Compose the message body
          let whatsappText = `*New inquiry from Royal Mentors website*%0A%0A`;
          whatsappText += `*Name:* ${name}%0A`;
          if (phone) whatsappText += `*Phone:* ${phone}%0A`;
          whatsappText += `*Message:* ${message}`;

          // Create WhatsApp URL (works on both mobile and web)
          const whatsappURL = `https://wa.me/${schoolWhatsApp}?text=${whatsappText}`;

          // Open WhatsApp in a new tab (fallback) or same window
          window.open(whatsappURL, '_blank');

          feedback.textContent = '✅ Opening WhatsApp...';
          // Optional: clear feedback after a few seconds
          setTimeout(() => { feedback.textContent = ''; }, 4000);
        });
      }

      // Make phone and email links open correct apps (already handled by href,
      // but we ensure they behave nicely inside the info-line)
      // Also we can add a small style to indicate they are clickable
      const style = document.createElement('style');
      style.innerHTML = `
        .info-line a:hover {
          text-decoration: underline !important;
          color: #c44536 !important;
        }
      `;
      document.head.appendChild(style);
    })();
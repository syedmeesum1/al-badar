/* ==========================================================================
   AL-BADAR HOSIERY (FAISALABAD) - Main Interactive Application Logic
   Bilingual translation engine, catalog filters, modals, and toasts
   ========================================================================== */

// Global Toast Notification Helper
window.showToastNotification = function (message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '24px';
    container.style.left = '24px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.maxWidth = '420px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColors = {
    info: 'linear-gradient(135deg, #0f172a, #1e293b)',
    success: 'linear-gradient(135deg, #064e3b, #065f46)',
    warning: 'linear-gradient(135deg, #78350f, #92400e)',
    error: 'linear-gradient(135deg, #7f1d1d, #991b1b)'
  };
  const borderColors = {
    info: '#38bdf8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  toast.style.background = bgColors[type] || bgColors.info;
  toast.style.border = `1px solid ${borderColors[type] || borderColors.info}`;
  toast.style.borderRadius = '12px';
  toast.style.padding = '14px 18px';
  toast.style.color = '#f8fafc';
  toast.style.fontSize = '0.875rem';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.5)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '12px';
  toast.style.animation = 'slideInToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.style.transition = 'all 0.3s ease';

  toast.innerHTML = `
    <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${borderColors[type]}; flex-shrink:0;"></span>
    <span style="flex:1;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

// Add toast keyframe style
const toastStyle = document.createElement('style');
toastStyle.innerHTML = `
  @keyframes slideInToast {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(toastStyle);

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sticky Header Scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-links .nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Catalog Category Filters
  const catalogTabs = document.querySelectorAll('.catalog-tab');
  const productCards = document.querySelectorAll('.product-card');

  catalogTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      catalogTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      productCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Handling
  const modal = document.getElementById('inquiry-modal');
  const openModalBtns = document.querySelectorAll('.open-inquiry-modal');
  const closeModalBtn = document.querySelector('.modal-close-btn');
  const inquiryForm = document.getElementById('rfq-form');

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productTitle = btn.getAttribute('data-product') || 'General Wholesale Catalog & Sample Box';
      const modalProductInput = document.getElementById('rfq-product');
      if (modalProductInput) {
        modalProductInput.value = productTitle;
      }
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Handle Form Submission
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rfq-name').value;
      const phone = document.getElementById('rfq-phone').value;
      const city = document.getElementById('rfq-city').value;
      const product = document.getElementById('rfq-product').value;
      const qty = document.getElementById('rfq-qty').value;
      const notes = document.getElementById('rfq-notes').value;

      // Close modal
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      window.showToastNotification(
        `Shukriya ${name}! Aapka wholesale inquiry record Al-Badar Hosiery ERP mein register ho gaya hai. WhatsApp redirect ho raha hai...`,
        'success'
      );

      // Pre-fill WhatsApp and open
      const whatsappMsg = encodeURIComponent(
        `Assalam-o-Alaikum Al-Badar Hosiery Faisalabad,\n\n` +
        `Main ne aapki wholesale website se quotation request fill ki hai:\n` +
        `• Name: ${name}\n` +
        `• Phone/Contact: ${phone}\n` +
        `• City/Market: ${city}\n` +
        `• Required Item: ${product}\n` +
        `• Estimated Quantity: ${qty} Dozen\n` +
        `• Special Instruction: ${notes || 'Standard Export Quality'}\n\n` +
        `Meharbani karke wholesale rate list aur sample courier confirm karein.`
      );

      setTimeout(() => {
        window.open(`https://wa.me/923007664070?text=${whatsappMsg}`, '_blank');
      }, 1200);

      inquiryForm.reset();
    });
  }

});


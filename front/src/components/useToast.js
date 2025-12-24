import { useEffect } from "react";

export default function useToast() {
  useEffect(() => {
    // Inject toast container styles only once
    if (!document.getElementById("MeduEase-toast-styles")) {
      const style = document.createElement("style");
      style.id = "MeduEase-toast-styles";
      style.innerHTML = `
        .MeduEase-toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 9999;
          min-width: 260px;
          max-width: 350px;
          background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
          color: #fff;
          border-radius: 1rem;
          box-shadow: 0 4px 24px 0 rgba(16,185,129,0.15);
          padding: 1.2rem 1.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0.98;
          animation: MeduEase-toast-in 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes MeduEase-toast-in {
          0% { transform: translateY(-40px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 0.98; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "MeduEase-toast";
    toast.innerHTML = `<i class='fas fa-check-circle text-2xl'></i> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 400);
    }, 2200);
  }

  return showToast;
}

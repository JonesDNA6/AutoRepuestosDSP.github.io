document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("form-message");
  const nosotrosSection = document.getElementById("nosotros");

  // Configuración del IntersectionObserver genérico
  const createObserver = (
    elements,
    animationClass,
    threshold = 0.1,
    unobserve = false
  ) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate__animated", animationClass);
            if (unobserve) observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );
    elements.forEach((el) => observer.observe(el));
    return observer;
  };

  // Manejo del formulario de contacto
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Validación del formulario
      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }

      try {
        const formData = new FormData(contactForm);
        const productTypes = Array.from(
          document.querySelectorAll(
            '#productType input[type="checkbox"]:checked'
          )
        ).map((checkbox) => checkbox.value);
        formData.set("productType", productTypes.join(", "));

        // Simulación de envío (reemplazar con fetch real si es necesario)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        formMessage.innerHTML = `
          <div class="alert alert-success" role="alert">
            ¡Tu cotización ha sido enviada con éxito! Nos pondremos en contacto pronto.
          </div>
        `;
        contactForm.reset();
        contactForm.classList.remove("was-validated");

        // Ejemplo de envío real con fetch (descomentar si aplica):
        /*
        const response = await fetch('/tu-ruta-de-envio', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        formMessage.innerHTML = `<div class="alert alert-${data.success ? 'success' : 'danger'}" role="alert">${data.message}</div>`;
        if (data.success) {
          contactForm.reset();
          contactForm.classList.remove('was-validated');
        }
        */
      } catch (error) {
        formMessage.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Hubo un error al enviar el formulario. Por favor, intenta de nuevo más tarde.
          </div>
        `;
        console.error("Error en el envío del formulario:", error);
      }
    });
  }

  // Animación para la sección "Nosotros"
  if (nosotrosSection) {
    createObserver(
      nosotrosSection.querySelectorAll(".col-lg-6, h3, p, ul, .text-center"),
      "animate__fadeInUp",
      0.2,
      true
    );
  }

  // Filtrado de productos
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      document.querySelectorAll(".product-item").forEach((product) => {
        const isVisible =
          filter === "all" || product.dataset.category === filter;
        product.style.display = isVisible ? "block" : "none";
        if (isVisible)
          product.classList.add("animate__animated", "animate__fadeIn");
      });
    });
  });

  // Animación para productos y tarjetas de sucursales
  createObserver(
    document.querySelectorAll(".product-item"),
    "animate__fadeInUp"
  );
  createObserver(
    document.querySelectorAll(".branch-card"),
    "animate__fadeInUp"
  );

  // Animación de tarjetas de servicio al hacer scroll
  window.addEventListener("scroll", () => {
    document.querySelectorAll(".service-card").forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      if (elementPosition < window.innerHeight * 0.75) {
        element.classList.add("animate__animated", "animate__fadeInUp");
      }
    });
  });

  // Smooth scroll para anclas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });
});

// Bootstrap bundle (asegúrate de incluirlo en el HTML si no está ya)

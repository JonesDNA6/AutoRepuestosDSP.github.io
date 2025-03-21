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

  document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const productTypeCheckboxes = document.querySelectorAll('input[name="productType"]');
    const productTypeFeedback = document.querySelector('#productType .invalid-feedback');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto del formulario

        // Validar el formulario
        if (!contactForm.checkValidity()) {
            contactForm.classList.add('was-validated');
            return;
        }

        // Validar que al menos un tipo de producto esté seleccionado
        let isProductTypeSelected = false;
        productTypeCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                isProductTypeSelected = true;
            }
        });

        if (!isProductTypeSelected) {
            productTypeFeedback.style.display = 'block';
            return;
        } else {
            productTypeFeedback.style.display = 'none';
        }

        // Recopilar los datos del formulario
        const formData = new FormData(contactForm);
        const formDataObject = {};
        formData.forEach((value, key) => {
            if (key === 'productType') {
                if (!formDataObject[key]) {
                    formDataObject[key] = [];
                }
                formDataObject[key].push(value);
            } else {
                formDataObject[key] = value;
            }
        });

        // Simulación de envío de datos (aquí iría tu lógica para enviar al servidor)
        console.log('Datos del formulario:', formDataObject);
        formMessage.textContent = 'Enviando su cotización...';

        // Simulación de envío exitoso después de un breve retraso
        setTimeout(() => {
            formMessage.textContent = '¡Cotización enviada con éxito! Nos pondremos en contacto pronto.';
            formMessage.className = 'success';
            contactForm.reset(); // Limpiar el formulario
            contactForm.classList.remove('was-validated'); // Remover la clase de validación
        }, 2000);

        // Si deseas enviar los datos a un servidor para procesar el correo,
        // aquí usarías fetch o XMLHttpRequest para hacer una petición POST.
        // Ejemplo conceptual con fetch:
        /*
        fetch('/enviar-cotizacion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObject)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                formMessage.textContent = '¡Cotización enviada con éxito! Nos pondremos en contacto pronto.';
                formMessage.className = 'success';
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            } else {
                formMessage.textContent = 'Hubo un error al enviar la cotización. Por favor, inténtalo de nuevo.';
                formMessage.className = 'error';
            }
        })
        .catch(error => {
            console.error('Error al enviar la cotización:', error);
            formMessage.textContent = 'Hubo un error al enviar la cotización. Por favor, inténtalo de nuevo.';
            formMessage.className = 'error';
        });
        */
    });

    // Validación en tiempo real del tipo de producto (opcional)
    productTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let isAnyChecked = false;
            productTypeCheckboxes.forEach(cb => {
                if (cb.checked) {
                    isAnyChecked = true;
                }
            });
            if (isAnyChecked) {
                productTypeFeedback.style.display = 'none';
            }
        });
    });
});
});

// Bootstrap bundle (asegúrate de incluirlo en el HTML si no está ya)

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("form-message");
  const nosotrosSection = document.getElementById("nosotros");
  const productItems = document.querySelectorAll(".product-item");
  const filterButtons = document.querySelectorAll(".filter-btn");

  const marcasSection = document.getElementById("marcas-section");
  const brandItems = document.querySelectorAll(".brand-item");

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          brandItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("brand-visible");
            }, index * 150);
          });
          observer.unobserve(marcasSection);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  sectionObserver.observe(marcasSection);

  // Configuración del IntersectionObserver genérico
  const createObserver = (
    elements,
    animationClassIn, // Clase para la animación cuando entra
    animationClassOut = null, // Clase para la animación cuando sale (opcional)
    threshold = 0.1,
    unobserve = false
  ) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClassIn);
            if (unobserve) observer.unobserve(entry.target);
          } else if (animationClassOut) {
            entry.target.classList.remove(animationClassIn);
            entry.target.classList.add(animationClassOut);
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
      null,
      0.2,
      true
    );
  }

  // Filtrado de productos
  const filterProducts = (filter) => {
    document.querySelectorAll(".product-item").forEach((product) => {
      const isVisible = filter === "all" || product.dataset.category === filter;
      product.style.display = isVisible ? "block" : "none";
    });
    // Reiniciar la observación después de filtrar
    observeProducts();
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter;
      filterProducts(filter);
    });
  });

  // Animación para productos (deslizándose desde abajo)
  const observeProducts = () => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("slide-up-hidden");
            entry.target.classList.add("slide-up-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    document
      .querySelectorAll(".product-item:not([style*='display: none'])")
      .forEach((item) => {
        item.classList.add("slide-up-hidden"); // Asegurar el estado inicial oculto
        observer.observe(item);
      });
  };

  // Inicializar la observación de los productos
  observeProducts();
  // Filtrar todos los productos al cargar la página
  filterProducts("all");

  // Animación para tarjetas de sucursales
  createObserver(
    document.querySelectorAll(".branch-card"),
    "animate__fadeInUp"
  );

  // Animación de tarjetas de servicio al hacer scroll (usando createObserver)
  createObserver(
    document.querySelectorAll(".service-card"),
    "animate__fadeInUp",
    null,
    0.75 // Ajustar el threshold si es necesario
  );

  // Smooth scroll para anclas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  const productTypeCheckboxes = document.querySelectorAll(
    'input[name="productType"]'
  );
  const productTypeFeedback = document.querySelector(
    "#productType .invalid-feedback"
  );

  // Validación en tiempo real del tipo de producto (opcional)
  productTypeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      let isAnyChecked = false;
      productTypeCheckboxes.forEach((cb) => {
        if (cb.checked) {
          isAnyChecked = true;
        }
      });
      if (isAnyChecked) {
        productTypeFeedback.style.display = "none";
      }
    });
  });

  // Filtrado de productos por categoría
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Eliminar la clase activa de todos los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Agregar la clase activa al botón seleccionado
      button.classList.add("active");

      const category = button.getAttribute("data-filter");

      // Mostrar u ocultar productos según la categoría seleccionada
      productItems.forEach((item) => {
        if (
          category === "all" ||
          item.getAttribute("data-category") === category
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // Mostrar descripción del producto en el modal
  const productModal = document.getElementById("productModal");
  const productDescription = document.getElementById("productDescription");

  productModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget; // Botón que abrió el modal
    const description = button.getAttribute("data-description"); // Extraer la descripción del botón
    productDescription.textContent = description; // Actualizar el contenido del modal
  });

  // JavaScript para la validación del formulario (Bootstrap)
  (function () {
    "use strict";

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll("#contactForm");

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        "submit",
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            // Aquí puedes agregar la lógica para enviar el formulario (ej. AJAX)
            event.preventDefault(); // Evita la recarga de la página por ahora
            document.getElementById("form-message").innerText =
              "¡Mensaje enviado! Nos pondremos en contacto contigo pronto.";
            form.reset();
          }

          form.classList.add("was-validated");
        },
        false
      );
    });
  })();

  const copyrightElement = document.querySelector("footer .container p");
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = `© ${currentYear} Tu Nombre de Empresa`;
  }
});

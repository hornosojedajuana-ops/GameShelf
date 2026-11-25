// msj de carga, error o resultado vacío
export function mensaje(elemento, texto, esError = false) {
    elemento.textContent = texto

    if (esError) {
        elemento.className = "status error"
    } else {
        elemento.className = "status"
    }

    if (texto === "") {
        elemento.style.display = "none"
    } else {
        elemento.style.display = "block"
    }
}

// etiquetas de cada juego
function etiquetasJuego(juego) {
    return `
        <span class="tag">${juego.genre}</span>
        <span class="tag">${juego.platform}</span>
        <span class="tag tag-date">${juego.release_date}</span>
    `
}

// las cards generales
export function renderJuegos(contenedor, juegos) {
    contenedor.innerHTML = ""

    if (juegos.length === 0) {
        return
    }

    juegos.forEach(juego => {
        contenedor.innerHTML += `
            <article class="game-card">
                <div class="game-cover">
                    <img src="${juego.thumbnail}" alt="Portada de ${juego.title}">
                </div>

                <div class="game-card-body">
                    <h3>${juego.title}</h3>
                    <p class="card-description">${juego.short_description}</p>

                    <div class="tags">
                        ${etiquetasJuego(juego)}
                    </div>

                    <div class="card-footer">
                        <button class="btn btn-primary btnDetalle"
                                type="button"
                                data-id="${juego.id}">
                            Ver detalle →
                        </button>
                    </div>
                </div>
            </article>
        `
    })
}

// juego aleatorio
export function mostrarJuegoSorpresa(imagen, placeholder, titulo, descripcion, etiquetas, juego) {
    imagen.src = juego.thumbnail
    imagen.alt = `Portada de ${juego.title}`
    imagen.style.display = "block"
    placeholder.style.display = "none"

    titulo.textContent = juego.title
    descripcion.textContent = juego.short_description
    etiquetas.innerHTML = `
        <span class="tag">${juego.genre}</span>
        <span class="tag">${juego.platform}</span>
    `
}

// últimos lanzamientos
export function mostrarLanzamiento(contenedor, contador, juego, posicion, total) {
    contenedor.innerHTML = `
        <article class="release-card">
            <img src="${juego.thumbnail}" alt="Portada de ${juego.title}">

            <div>
                <p class="eyebrow">LANZAMIENTO RECIENTE</p>
                <h3>${juego.title}</h3>
                <p>${juego.short_description}</p>

                <div class="tags">
                    ${etiquetasJuego(juego)}
                </div>

                <button type="button"
                        class="btn btn-primary btnDetalle"
                        data-id="${juego.id}">
                    Ver detalle →
                </button>
            </div>
        </article>
    `

    contador.textContent = `${posicion + 1} / ${total}`
}

// screenshots
function capturasHTML(juego) {
    if (!juego.screenshots || juego.screenshots.length === 0) {
        return `<p class="muted">Capturas no disponibles.</p>`
    }

    let html = `<div class="screenshots">`

    juego.screenshots.forEach((captura, indice) => {
        if (indice < 6) {
            html += `
                <a href="${captura.image}" target="_blank">
                    <img src="${captura.image}" alt="Captura de ${juego.title}">
                </a>
            `
        }
    })

    html += `</div>`
    return html
}

// requisitos mínimos
function requisitosHTML(requisitos) {
    if (!requisitos) {
        return `<p class="muted">Requisitos mínimos no disponibles para este videojuego.</p>`
    }

    return `
        <div class="requirements">
            <div class="info-item">
                <span>Sistema operativo</span>
                <strong>${requisitos.os || "No disponible"}</strong>
            </div>
            <div class="info-item">
                <span>Procesador</span>
                <strong>${requisitos.processor || "No disponible"}</strong>
            </div>
            <div class="info-item">
                <span>Memoria RAM</span>
                <strong>${requisitos.memory || "No disponible"}</strong>
            </div>
            <div class="info-item">
                <span>Gráficos</span>
                <strong>${requisitos.graphics || "No disponible"}</strong>
            </div>
            <div class="info-item">
                <span>Almacenamiento</span>
                <strong>${requisitos.storage || "No disponible"}</strong>
            </div>
        </div>
    `
}

// pop-up de detalle
export function renderDetalle(contenedor, juego) {
    contenedor.innerHTML = `
        <div class="game-detail">

            <div class="detail-hero">

                <div class="detail-cover-wrap">
                    <img class="detail-cover"
                         src="${juego.thumbnail}"
                         alt="Portada de ${juego.title}">
                </div>

                <div class="detail-copy">

                    <p class="eyebrow">GAME PROFILE</p>

                    <h2 id="detalle-titulo">
                        ${juego.title}
                    </h2>

                    <div class="tags">
                        <span class="tag">${juego.genre}</span>
                        <span class="tag">${juego.platform}</span>
                        <span class="tag tag-date">
                            ${juego.status || "Estado no disponible"}
                        </span>
                    </div>

                    <p class="detail-description">
                        ${juego.description || juego.short_description || "Descripción no disponible."}
                    </p>

                    <div class="detail-actions">
                        <a class="btn btn-secondary"
                           href="${juego.game_url}"
                           target="_blank">
                            Ir al juego ↗
                        </a>

                        <button
                            class="btn btn-primary btnAgregar"
                            type="button"
                            data-id="${juego.id}">
                            Añadir a biblioteca →
                        </button>
                    </div>
                </div>

            </div>

            <section class="detail-section">

                <div class="detail-section-header">
                    <h3>Información general</h3>
                    <span class="recommendation-kicker">GAME DATA</span>
                </div>

                <div class="info-grid">
                    <div class="info-item">
                        <span>Desarrollador</span>
                        <strong>${juego.developer || "No disponible"}</strong>
                    </div>

                    <div class="info-item">
                        <span>Distribuidora</span>
                        <strong>${juego.publisher || "No disponible"}</strong>
                    </div>

                    <div class="info-item">
                        <span>Lanzamiento</span>
                        <strong>${juego.release_date || "No disponible"}</strong>
                    </div>
                </div>

            </section>

            <section class="detail-section">

                <div class="detail-section-header">
                    <h3>Capturas de pantalla</h3>
                    <span class="recommendation-kicker">GALLERY</span>
                </div>

                ${capturasHTML(juego)}

            </section>

            <section class="detail-section">

                <div class="detail-section-header">
                    <h3>Requisitos mínimos de PC</h3>
                    <span class="recommendation-kicker">SYSTEM</span>
                </div>

                ${requisitosHTML(juego.minimum_system_requirements)}

            </section>

        </div>
    `
}
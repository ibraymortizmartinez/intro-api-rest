const API_URL = 'https://698a1871c04d974bc6a1579f.mockapi.io/api/v1/dispositivos_IoT';

const deviceForm = document.getElementById('deviceForm');
const tableBody = document.getElementById('deviceTableBody');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');

// Mapeo de direcciones para mostrar texto en lugar de números
const direccionesMap = {
    "1": "Adelante", "2": "Detener", "3": "Atrás",
    "4": "Vuelta Der. Adelante", "5": "Vuelta Izq. Adelante",
    "6": "Vuelta Der. Atrás", "7": "Vuelta Izq. Atrás",
    "8": "Giro 90° Der.", "9": "Giro 90° Izq."
};

document.addEventListener('DOMContentLoaded', getDevices);

// CREATE & UPDATE
deviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('deviceId').value;
    const data = {
        deviceName: document.getElementById('deviceName').value,
        direccion: document.getElementById('direccion').value,
        // MockAPI generará el resto (dateTime, ipCliente) automáticamente por el esquema
    };

    try {
        if (id) {
            // Update
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // Create
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }
        resetForm();
        getDevices();
    } catch (error) {
        console.error("Error al guardar:", error);
    }
});

// READ
async function getDevices() {
    try {
        const response = await fetch(API_URL);
        const devices = await response.json();
        renderTable(devices);
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

function renderTable(devices) {
    tableBody.innerHTML = '';
    devices.forEach(device => {
        tableBody.innerHTML += `
            <tr>
                <td><small class="text-muted">${device.id}</small></td>
                <td><strong>${device.deviceName}</strong></td>
                <td><span class="badge bg-info text-dark">${direccionesMap[device.direccion] || device.direccion}</span></td>
                <td><code class="small">${device.ipCliente}</code></td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editDevice('${device.id}', '${device.deviceName}', '${device.direccion}')">✏️</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDevice('${device.id}')">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// DELETE
async function deleteDevice(id) {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            getDevices();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// Helper: Llenar formulario para editar
function editDevice(id, name, dir) {
    document.getElementById('deviceId').value = id;
    document.getElementById('deviceName').value = name;
    document.getElementById('direccion').value = dir;
    
    document.getElementById('formTitle').innerText = "Editar Dispositivo";
    btnSubmit.innerText = "Actualizar";
    btnCancel.classList.remove('d-none');
}

// Helper: Limpiar formulario
function resetForm() {
    deviceForm.reset();
    document.getElementById('deviceId').value = '';
    document.getElementById('formTitle').innerText = "Registrar Dispositivo";
    btnSubmit.innerText = "Guardar";
    btnCancel.classList.add('d-none');
}
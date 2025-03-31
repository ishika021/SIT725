$(document).ready(function() {
    $('.modal').modal();
    $('select').formSelect();
    $('.sidenav').sidenav();

    loadStations();

    $('#submit-station').click(addStation);
    $('#update-station').click(updateStation);
    $('#search-input').on('keyup', searchStations);

    $('#stations-container').on('click', '.station-card', function() {
        const stationId = $(this).data('id');
        openStationDetails(stationId);
    });

    $('#delete-station').click(function() {
        const stationId = $('#detail-station-name').data('id');
        deleteStation(stationId);
    });

    $('#edit-station').click(function() {
        const stationId = $('#detail-station-name').data('id');
        prepareEditForm(stationId);
    });
});

function loadStations() {
    $('#stations-container').html('<div class="center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');

    $.ajax({
        url: '/api/stations',
        type: 'GET',
        success: function(response) {
            const stations = response.data;
            displayStations(stations);
        },
        error: function(error) {
            console.error('Error loading stations:', error);
            M.toast({html: 'Failed to load stations. Please try again later.'});

            $('#stations-container').html('<div class="empty-state"><i class="material-icons">sentiment_dissatisfied</i><h4>Couldn\'t load stations</h4><p>There was a problem connecting to the server.</p></div>');
        }
    });
}

function displayStations(stations) {
    let html = '';

    if (stations.length === 0) {
        html = '<div class="empty-state"><i class="material-icons">ev_station</i><h4>No Stations Found</h4><p>Be the first to add a charging station!</p><a class="btn green modal-trigger" href="#add-station-modal">Add Station</a></div>';
    } else {
        html = '<div class="row">';
        stations.forEach(station => {
            let imageUrl = station.image;
            if (!imageUrl) {
                imageUrl = 'images/ev.jpg';
            } else if (!imageUrl.startsWith('http')) {
                imageUrl = `${imageUrl}`;
            }

            html += `
                <div class="col s12 m6 l4">
                    <div class="card hoverable station-card" data-id="${station._id}">
                        <div class="card-image">
                            <img src="${imageUrl}" alt="${station.stationName || 'EV Station'}" class="responsive-img">
                            <span class="station-type-badge">${station.type || 'Unknown Type'}</span>
                        </div>
                        <div class="card-content">
                            <h5>${station.stationName}</h5>
                            <p><strong>Cost:</strong> $${station.cost || '0.00'}/kWh</p>
                        </div>
                        <div class="card-action">
                            <a href="#!" class="green-text text-darken-2">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    $('#stations-container').html(html);
}

function addStation() {
    const newStation = {
        stationName: $('#station-name').val(),
        address: $('#station-address').val(),
        city: $('#station-city').val(),
        state: $('#station-state').val(),
        type: $('#station-type').val(),
        cost: parseFloat($('#station-cost').val()) || 0,
        description: $('#station-description').val(),
        image: $('#station-image').val() || null
    };

    if (!newStation.stationName || !newStation.address || !newStation.city || !newStation.state || !newStation.type) {
        M.toast({html: 'Please fill all required fields'});
        return;
    }

    $.ajax({
        url: '/api/stations',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newStation),
        success: function(response) {
            M.toast({html: 'Station added successfully!'});
            $('#add-station-modal').modal('close');
            $('#add-station-form')[0].reset();
            loadStations();
        },
        error: function(error) {
            console.error('Error adding station:', error);
            M.toast({html: 'Failed to add station. Please try again.'});
        }
    });
}

function openStationDetails(stationId) {
    $.ajax({
        url: `/api/stations`,
        type: 'GET',
        success: function(response) {
            const stations = response.data;
            const station = stations.find(s => s._id === stationId);

            if (station) {
                $('#detail-station-name').text(station.stationName).data('id', station._id);
                $('#detail-station-address').text(station.address);
                $('#detail-station-city').text(station.city);
                $('#detail-station-state').text(station.state);
                $('#detail-station-type').text(station.type);
                $('#detail-station-cost').text(station.cost || '0.00');
                $('#detail-station-description').text(station.description || 'No description available');

                const imageUrl = station.image || 'images/ev.jpg';
                $('#detail-station-image').attr('src', imageUrl);

                $('#station-details-modal').modal('open');
            } else {
                M.toast({html: 'Station details not found'});
            }
        },
        error: function(error) {
            console.error('Error getting station details:', error);
            M.toast({html: 'Failed to load station details'});
        }
    });
}

function prepareEditForm(stationId) {
    $('#station-details-modal').modal('close');

    $.ajax({
        url: `/api/stations`,
        type: 'GET',
        success: function(response) {
            const stations = response.data;
            const station = stations.find(s => s._id === stationId);

            if (station) {
                $('#edit-station-id').val(station._id);
                $('#edit-station-name').val(station.stationName);
                $('#edit-station-address').val(station.address);
                $('#edit-station-city').val(station.city);
                $('#edit-station-state').val(station.state);
                $('#edit-station-cost').val(station.cost || '');
                $('#edit-station-description').val(station.description || '');
                $('#edit-station-image').val(station.image || '');

                const selectElement = document.getElementById('edit-station-type');
                const instance = M.FormSelect.getInstance(selectElement);
                if (instance) {
                    instance.destroy();
                }

                $('#edit-station-type').val(station.type);
                M.FormSelect.init(selectElement);

                M.updateTextFields();

                $('#edit-station-modal').modal('open');
            } else {
                M.toast({html: 'Station details not found'});
            }
        },
        error: function(error) {
            console.error('Error getting station details for edit:', error);
            M.toast({html: 'Failed to load station details'});
        }
    });
}

function updateStation() {
    const stationId = $('#edit-station-id').val();
    const updatedStation = {
        stationName: $('#edit-station-name').val(),
        address: $('#edit-station-address').val(),
        city: $('#edit-station-city').val(),
        state: $('#edit-station-state').val(),
        type: $('#edit-station-type').val(),
        cost: parseFloat($('#edit-station-cost').val()) || 0,
        description: $('#edit-station-description').val(),
        image: $('#edit-station-image').val() || null
    };

    if (!updatedStation.stationName || !updatedStation.address || !updatedStation.city || !updatedStation.state || !updatedStation.type) {
        M.toast({html: 'Please fill all required fields'});
        return;
    }

    $.ajax({
        url: `/api/stations/${stationId}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedStation),
        success: function(response) {
            M.toast({html: 'Station updated successfully!'});
            $('#edit-station-modal').modal('close');
            loadStations();
        },
        error: function(error) {
            console.error('Error updating station:', error);
            M.toast({html: 'Failed to update station. Please try again.'});
        }
    });
}

function deleteStation(stationId) {
    if (confirm('Are you sure you want to delete this station? This action cannot be undone.')) {
        $.ajax({
            url: `/api/stations/${stationId}`,
            type: 'DELETE',
            success: function(response) {
                M.toast({html: 'Station deleted successfully!'});
                $('#station-details-modal').modal('close');
                loadStations();
            },
            error: function(error) {
                console.error('Error deleting station:', error);
                M.toast({html: 'Failed to delete station. Please try again.'});
            }
        });
    }
}

function searchStations() {
    const searchTerm = $('#search-input').val().toLowerCase();

    if (!searchTerm) {
        loadStations();
        return;
    }

    $('#stations-container').html('<div class="center-align"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>');

    $.ajax({
        url: '/api/stations',
        type: 'GET',
        success: function(response) {
            const stations = response.data;

            const filteredStations = stations.filter(station => {
                return station.stationName.toLowerCase().includes(searchTerm) || 
                       station.city.toLowerCase().includes(searchTerm) || 
                       station.state.toLowerCase().includes(searchTerm) || 
                       station.address.toLowerCase().includes(searchTerm);
            });

            displayStations(filteredStations);
        },
        error: function(error) {
            console.error('Error searching stations:', error);
            M.toast({html: 'Failed to search stations. Please try again.'});
        }
    });
}
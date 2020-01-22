const remote = require('electron').remote

const RegInapD = {
    template: `
        <div class="modal" tabindex="-1" role="dialog" id="modal1">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Registrasi Rawat Inap</h5>
                        <button type="button" class="close" data-dismiss="modal" @click="$emit('close')" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>No. Rawat</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control form-control-sm">
                                        <div class="input-group-append">
                                            <button class="btn btn-sm btn-outline-secondary" type="button">...</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>No. RM</label>
                                    <input type="text" class="form-control form-control-sm" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Nama</label>
                                    <input type="text" class="form-control form-control-sm" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Kamar</label>
                                    <input type="text" class="form-control form-control-sm">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <input type="text" class="form-control form-control-sm" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <div class="input-group">
                                        <input type="text" class="form-control form-control-sm" readonly>
                                        <div class="input-group-append">
                                            <button class="btn btn-sm btn-outline-secondary" type="button">...</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Status Kamar</label>
                                    <input type="text" class="form-control form-control-sm" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Tanggal</label>
                                    <input type="date" class="form-control form-control-sm">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label>Jam</label>
                                    <input type="time" step="1" class="form-control form-control-sm">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Diagnosa Awal Masuk</label>
                                    <input type="text" class="form-control form-control-sm">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label>Biaya</label>
                                    <input type="text" class="form-control form-control-sm">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <div class="input-group input-group-sm">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">&times;</span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>&nbsp;</label>
                                    <div class="input-group input-group-sm">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">&equals;</span>
                                        </div>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal" @click="$emit('close')">Tutup</button>
                        <button type="button" class="btn btn-primary btn-sm">Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `
}

export { RegInapD }
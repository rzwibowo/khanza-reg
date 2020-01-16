const RegComp = {
    template: `
        <div class="container-fluid p-0">
            <div class="row m-0">
                <div class="col-md-3 p-0" v-show="visible">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <h5 class="card-title">Biodata Pasien</h5>
                            <div class="form-group">
                                <label>No. Pasien</label>
                                <div class="input-group">
                                    <input type="text" class="form-control form-control-sm">
                                    <div class="input-group-append">
                                        <button class="btn btn-sm btn-outline-secondary" type="button">...</button>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Nama Lengkap</label>
                                <input type="text" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="row align-items-end">
                                <div class="col-md-8">
                                    <div class="form-group">
                                        <label>NIK</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-sm btn-outline-secondary" type="button">Cek BPJS</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Alamat</label>
                                <input type="text" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Status Pasien</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>No. Asuransi</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Lahir</label>
                                        <input type="text" class="form-control form-control-sm" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Umur (Th/Bln/Hr)</label>
                                        <div>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" readonly>
                            </div>
                            <div class="form-group">
                                <label>Nama Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" readonly>
                            </div>
                            <button type="button" class="btn btn-sm btn-secondary">Cetak Kartu</button>
                            <button type="button" class="btn btn-sm btn-secondary">Cetak Form</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 p-0" v-show="visible">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <h5 class="card-title">Entri Kunjungan</h5>
                            <div class="form-group">
                                <label for="">Tanggal</label>
                                <input type="date" name="" id="" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="">Jam</label>
                                <input type="time" name="" id="" class="form-control" step="1">
                            </div>
                            <div class="form-group">
                                <label for="">Jenis Pembayaran</label>
                                <div>
                                    <input type="text" class="form-control" style="display: inline-block; width: 25%;">
                                    <select name="" id="" class="form-control" style="display: inline-block; width: 70%;"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">Asal Rujukan</label>
                                <div>
                                    <input type="text" class="form-control" style="display: inline-block; width: 25%;">
                                    <select name="" id="" class="form-control" style="display: inline-block; width: 70%;"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">Ruang Poliklinik</label>
                                <div>
                                    <input type="text" class="form-control" style="display: inline-block; width: 25%;">
                                    <select name="" id="" class="form-control" style="display: inline-block; width: 70%;"></select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">Dokter Periksa</label>
                                <div>
                                    <input type="text" class="form-control" style="display: inline-block; width: 25%;">
                                    <select name="" id="" class="form-control" style="display: inline-block; width: 70%;"></select>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right">Simpan</button>
                                <button type="button" class="btn btn-sm btn-secondary">Pasien Baru</button>
                                <button type="button" class="btn btn-sm btn-secondary">Kosongkan</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="{'col-md-6': visible, 'col-md-12': !visible}">
                    <div class="row">
                        <div class="col-md-12">
                            <button type="button" class="btn btn-sm btn-secondary" 
                                @click="visible = !visible">{{ visible ? '&lt;' : '&gt;' }} Tugel Form </button>
                        </div>
                    </div>
                    <div class="table-responsive" style="height: 90vh;">
                        <table class="table table-sm table-hover table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>No. Reg</th>
                                    <th>Tanggal</th>
                                    <th>Jam</th>
                                    <th>Nama</th>
                                    <th>Tanggal Lahir</th>
                                    <th>Alamat</th>
                                    <th>Dokter</th>
                                    <th>Klinik</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            visible: true
        }
    }
}

export { RegComp }
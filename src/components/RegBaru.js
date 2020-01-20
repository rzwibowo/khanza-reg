const remote = require('electron').remote

const RegBaru = {
    template: `
        <div class="container-fluid">
            <h3>Pasien Baru</h3>
            <div class="row m-0">
                <div class="col-md-4 p-0">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <div class="form-group">
                                <label>No. RM</label>
                                <input type="text" class="form-control form-control-sm" readonly="readonly">
                            </div>
                            <div class="form-group">
                                <label>Nama</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="form-group">
                                <label>Jenis Kelamin</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                                            value="option1">
                                        <label class="form-check-label" for="inlineRadio1">Laki-laki</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                            value="option2">
                                        <label class="form-check-label" for="inlineRadio2">Perempuan</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Golongan Darah</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1"
                                            value="option1">
                                        <label class="form-check-label" for="inlineRadio1">-</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                            value="option2">
                                        <label class="form-check-label" for="inlineRadio2">A</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                            value="option2">
                                        <label class="form-check-label" for="inlineRadio2">B</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                            value="option2">
                                        <label class="form-check-label" for="inlineRadio2">AB</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2"
                                            value="option2">
                                        <label class="form-check-label" for="inlineRadio2">O</label>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Tempat Lahir</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Lahir</label>
                                        <input type="date" class="form-control form-control-sm">
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
                                <label>Nama Ibu</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>
                    <div class="card-body px-1">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Suku Bangsa</label>
                                    <select class="form-control form-control-sm"></select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Bahasa</label>
                                    <select class="form-control form-control-sm"></select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cacat Fisik</label>
                            <select class="form-control form-control-sm"></select>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Instansi Pasien</label>
                                    <select class="form-control form-control-sm"></select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>NIP/NRP</label>
                                    <input type="text" class="form-control form-control-sm">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 p-0">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Agama</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Status Nikah</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Pendidikan</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Pekerjaan</label>
                                        <input type="text" class="form-control form-control-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Daftar</label>
                                        <input type="date" class="form-control form-control-sm">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>NIK</label>
                                        <input type="text" class="form-control form-control-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Jenis Asuransi</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>No. Peserta</label>
                                        <input type="text" class="form-control form-control-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>No. Telepon</label>
                                        <input type="tel" class="form-control form-control-sm">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control form-control-sm">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Alamat</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kelurahan</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Provinsi</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 p-0">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <div class="form-group">
                                <label>Penanggung Jawab</label>
                                <select class="form-control form-control-sm"></select>
                            </div>
                            <div class="form-group">
                                <label>Nama Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="form-group">
                                <label>Pekerjaan Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="form-group">
                                <label>Alamat Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kelurahan</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Provinsi</label>
                                        <select class="form-control form-control-sm"></select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right">Simpan</button>
                                <a class="btn btn-sm btn-secondary" href="#/">Kembali</a>
                                <button type="button" class="btn btn-sm btn-secondary">Kosongkan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    mounted: function () {
        const name =  require('./package.json').name
        remote.getCurrentWindow().setTitle(`${name} | Registrasi Pasien Baru`)
    }

}

export { RegBaru }
const remote = require('electron').remote

import { dbUtil } from '../dbconn.js'

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
                                    <select class="form-control form-control-sm">
                                        <option v-for="sk in sukus" :key="sk.id" :value="sk.id">
                                            {{ sk.nama_suku_bangsa }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Bahasa</label>
                                    <select class="form-control form-control-sm">
                                        <option v-for="bhs in bahasas" :key="bhs.id" :value="bhs.id">
                                            {{ bhs.nama_bahasa }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cacat Fisik</label>
                            <select class="form-control form-control-sm">
                                <option v-for="cc in cacats" :key="cc.id" :value="cc.id">
                                    {{ cc.nama_cacat }}
                                </option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Instansi Pasien</label>
                                    <select class="form-control form-control-sm">
                                        <option v-for="ps in perusahaans" :key="ps.kode_perusahaan" 
                                            :value="ps.kode_perusahaan">
                                            {{ ps.nama_perusahaan }}
                                        </option>
                                    </select>
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
                                        <select class="form-control form-control-sm">
                                            <option value="ISLAM">ISLAM</option>
                                            <option value="KRISTEN">KRISTEN</option>
                                            <option value="KATOLIK">KATOLIK</option>
                                            <option value="HINDU">HINDU</option>
                                            <option value="BUDHA">BUDHA</option>
                                            <option value="KONG HU CHU">KONG HU CHU</option>
                                            <option value="-">-</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Status Nikah</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="(sn, index) in st_nikahs" :key="index" 
                                                :value="sn">
                                                {{ sn }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Pendidikan</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="(pd, index) in pendidikans" :key="index" 
                                                :value="pd">
                                                {{ pd }}
                                            </option>
                                        </select>
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
                                        <select class="form-control form-control-sm">
                                            <option v-for="as in asuransis" :key="as.kd_pj" 
                                                :value="as.kd_pj">
                                                {{ as.png_jawab }}
                                            </option>
                                        </select>
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
                                        <select class="form-control form-control-sm">
                                            <option v-for="kl in kelurahans" :key="kl.kd_kel" 
                                                :value="kl.kd_kel">
                                                {{ kl.nm_kel }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="kc in kecamatans" :key="kc.kd_kec" 
                                                :value="kc.kd_kec">
                                                {{ kc.nm_kec }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="kb in kabupatens" :key="kb.kd_kab" 
                                                :value="kb.kd_kab">
                                                {{ kb.nm_kab }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Provinsi</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="pp in propinsis" :key="pp.kd_prop" 
                                                :value="pp.kd_prop">
                                                {{ pp.nm_prop }}
                                            </option>
                                        </select>
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
                                <select class="form-control form-control-sm">
                                    <option v-for="(kl, index) in keluargas" :key="index" 
                                        :value="kl">
                                        {{ kl }}
                                    </option>
                                </select>
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
                                        <select class="form-control form-control-sm">
                                            <option v-for="kl in kelurahans" :key="kl.kd_kel" 
                                                :value="kl.kd_kel">
                                                {{ kl.nm_kel }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kecamatan</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="kc in kecamatans" :key="kc.kd_kec" 
                                                :value="kc.kd_kec">
                                                {{ kc.nm_kec }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kabupaten</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="kb in kabupatens" :key="kb.kd_kab" 
                                                :value="kb.kd_kab">
                                                {{ kb.nm_kab }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Provinsi</label>
                                        <select class="form-control form-control-sm">
                                            <option v-for="pp in propinsis" :key="pp.kd_prop" 
                                                :value="pp.kd_prop">
                                                {{ pp.nm_prop }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right">Simpan</button>
                                <a class="btn btn-sm btn-secondary" href="#/">Kembali</a>
                                <button type="button" class="btn btn-sm btn-secondary" 
                                    @click="reg = {}">Kosongkan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            reg: {},
            sukus: [],
            bahasas: [],
            cacats: [],
            st_nikahs: [],
            pendidikans: [],
            asuransis: [],
            perusahaans: [],
            kelurahans: [],
            kecamatans: [],
            kabupatens: [],
            propinsis: [],
            keluargas: []
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.getListSuku()
        this.getListBahasa()
        this.getListCacat()
        this.getListStnikah()
        this.getListPendidikan()
        this.getListAsuransi()
        this.getListPerusahaan()
        this.getListKelurahan()
        this.getListKecamatan()
        this.getListKabupaten()
        this.getListPropinsi()
        this.getListKeluarga()
    },
    methods: {
        getListSuku: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    id, nama_suku_bangsa
                FROM
                    suku_bangsa`)
                .then(res => {
                    this.sukus = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListBahasa: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    id, nama_bahasa
                FROM
                    bahasa_pasien`)
                .then(res => {
                    this.bahasas = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListCacat: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    id, nama_cacat
                FROM
                    cacat_fisik`)
                .then(res => {
                    this.cacats = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListPerusahaan: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kode_perusahaan, nama_perusahaan
                FROM
                    perusahaan_pasien`)
                .then(res => {
                    this.perusahaans = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListStnikah: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    COLUMN_TYPE
                FROM 
                    information_schema.\`COLUMNS\`
                WHERE 
                    TABLE_NAME = 'pasien'
                    AND COLUMN_NAME = 'stts_nikah'
                    LIMIT 1 `)
                .then(res => {
                    this.st_nikahs = res[0].COLUMN_TYPE
                        .split(',').map(item => { return item.split("'") })
                        .map(item => { return item[1] })
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListPendidikan: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    COLUMN_TYPE
                FROM 
                    information_schema.\`COLUMNS\`
                WHERE 
                    TABLE_NAME = 'pasien'
                    AND COLUMN_NAME = 'pnd'
                    LIMIT 1 `)
                .then(res => {
                    this.pendidikans = res[0].COLUMN_TYPE
                        .split(',').map(item => { return item.split("'") })
                        .map(item => { return item[1] })
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListAsuransi: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_pj, png_jawab
                FROM
                    penjab`)
                .then(res => {
                    this.asuransis = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListKelurahan: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_kel, nm_kel
                FROM
                    kelurahan`)
                .then(res => {
                    this.kelurahans = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListKecamatan: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_kec, nm_kec
                FROM
                    kecamatan`)
                .then(res => {
                    this.kecamatans = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListKabupaten: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_kab, nm_kab
                FROM
                    kabupaten`)
                .then(res => {
                    this.kabupatens = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListPropinsi: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT
                    kd_prop, nm_prop
                FROM
                    propinsi`)
                .then(res => {
                    this.propinsis = res
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        getListKeluarga: function () {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    COLUMN_TYPE
                FROM 
                    information_schema.\`COLUMNS\`
                WHERE 
                    TABLE_NAME = 'pasien'
                    AND COLUMN_NAME = 'keluarga'
                    LIMIT 1 `)
                .then(res => {
                    this.keluargas = res[0].COLUMN_TYPE
                        .split(',').map(item => { return item.split("'") })
                        .map(item => { return item[1] })
                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        setWindowTitle: function () {
            const name =  require('./package.json').name
            remote.getCurrentWindow().setTitle(`${name} | Registrasi Pasien Baru`)
        }
    }

}

export { RegBaru }
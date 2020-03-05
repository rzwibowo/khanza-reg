const remote = require('electron').remote

import { dbUtil } from '../dbconn.js'

const RegBaru = {
    template: `
        <div class="container-fluid">
            <h5>Pasien Baru</h5>
            <div class="row m-0">
                <div class="col-md-4 p-0">
                    <div class="card p-0">
                        <div class="card-body px-1">
                            <div class="form-group">
                                <label>No. RM</label>
                                <input type="text" class="form-control form-control-sm" 
                                    readonly="readonly" v-model="reg.no_rkm_medis">
                            </div>
                            <div class="form-group">
                                <label>Nama</label>
                                <input type="text" class="form-control form-control-sm"
                                    v-model="reg.nm_pasien" :class="{'is-invalid': invalid_input.includes('nm_pasien')}">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tempat Lahir</label>
                                        <input type="text" class="form-control form-control-sm"
                                            v-model="reg.tmp_lahir" :class="{'is-invalid': invalid_input.includes('tmp_lahir')}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Lahir</label>
                                        <input type="date" class="form-control form-control-sm"
                                            v-model="reg.tgl_lahir" :class="{'is-invalid': invalid_input.includes('tgl_lahir')}"
                                            :max="reg.tgl_daftar">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Jenis Kelamin</label>
                                        <div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="jenkel"
                                                    value="L" v-model="reg.jk">
                                                <label class="form-check-label">Laki-laki</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="jenkel"
                                                    value="P" v-model="reg.jk">
                                                <label class="form-check-label">Perempuan</label>
                                            </div>
                                        </div>
                                        <div class="alert alert-danger" role="alert" v-if="invalid_input.includes('jk')">
                                            Pilih jenis kelamin
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Umur (Th/Bln/Hr)</label>
                                        <div>
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly
                                                :value="umur.th">
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly
                                                :value="umur.bln">
                                            <input type="text" class="form-control form-control-sm" 
                                                style="display: inline-block; width: 30%;" readonly
                                                :value="umur.hr">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Golongan Darah</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="goldar"
                                            value="-" v-model="reg.gol_darah">
                                        <label class="form-check-label">-</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="goldar"
                                            value="A" v-model="reg.gol_darah">
                                        <label class="form-check-label">A</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="goldar"
                                            value="B" v-model="reg.gol_darah">
                                        <label class="form-check-label">B</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="goldar"
                                            value="AB" v-model="reg.gol_darah">
                                        <label class="form-check-label">AB</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="goldar"
                                            value="O" v-model="reg.gol_darah">
                                        <label class="form-check-label">O</label>
                                    </div>
                                </div>
                                <div class="alert alert-danger" role="alert" v-if="invalid_input.includes('gol_darah')">
                                    Pilih golongan darah
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Nama Ibu</label>
                                <input type="text" class="form-control form-control-sm"
                                    v-model="reg.nm_ibu" :class="{'is-invalid': invalid_input.includes('nm_ibu')}">
                            </div>
                        </div>
                    </div>
                    <div class="card-body px-1">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Suku Bangsa</label>
                                    <select class="form-control form-control-sm" v-model="reg.suku_bangsa">
                                        <option v-for="sk in sukus" :key="sk.id" :value="sk.id">
                                            {{ sk.nama_suku_bangsa }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Bahasa</label>
                                    <select class="form-control form-control-sm" v-model="reg.bahasa_pasien">
                                        <option v-for="bhs in bahasas" :key="bhs.id" :value="bhs.id">
                                            {{ bhs.nama_bahasa }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Cacat Fisik</label>
                            <select class="form-control form-control-sm" v-model="reg.cacat_fisik">
                                <option v-for="cc in cacats" :key="cc.id" :value="cc.id">
                                    {{ cc.nama_cacat }}
                                </option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Instansi Pasien</label>
                                    <select class="form-control form-control-sm" v-model="reg.perusahaan_pasien">
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
                                    <input type="text" class="form-control form-control-sm" v-model="reg.nip">
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
                                        <select class="form-control form-control-sm" v-model="reg.agama" 
                                            :class="{'is-invalid': invalid_input.includes('agama')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.stts_nikah"
                                            :class="{'is-invalid': invalid_input.includes('stts_nikah')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.pnd"
                                            :class="{'is-invalid': invalid_input.includes('pnd')}">
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
                                        <input type="text" class="form-control form-control-sm" v-model="reg.pekerjaan"
                                            :class="{'is-invalid': invalid_input.includes('pekerjaan')}">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Tanggal Daftar</label>
                                        <input type="date" class="form-control form-control-sm" v-model="reg.tgl_daftar"
                                            :class="{'is-invalid': invalid_input.includes('tgl_daftar')}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>NIK</label>
                                        <input type="text" class="form-control form-control-sm" v-model="reg.no_ktp"
                                            :class="{'is-invalid': invalid_input.includes('nik')}">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Jenis Asuransi</label>
                                        <select class="form-control form-control-sm" v-model="reg.kd_pj"
                                            :class="{'is-invalid': invalid_input.includes('kd_pj')}">
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
                                        <input type="text" class="form-control form-control-sm" v-model="reg.no_peserta"
                                            :class="{'is-invalid': invalid_input.includes('no_peserta')}">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>No. Telepon</label>
                                        <input type="tel" class="form-control form-control-sm" v-model="reg.no_tlp"
                                            :class="{'is-invalid': invalid_input.includes('no_tlp')}">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" class="form-control form-control-sm" v-model="reg.email"
                                            :class="{'is-invalid': invalid_input.includes('email')}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Alamat</label>
                                <input type="text" class="form-control form-control-sm" v-model="reg.alamat"
                                    :class="{'is-invalid': invalid_input.includes('alamat')}">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kelurahan</label>
                                        <select class="form-control form-control-sm" v-model="reg.kd_kel"
                                            :class="{'is-invalid': invalid_input.includes('kd_kel')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.kd_kec"
                                            :class="{'is-invalid': invalid_input.includes('kd_kec')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.kd_kab"
                                            :class="{'is-invalid': invalid_input.includes('kd_kab')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.kd_prop"
                                            :class="{'is-invalid': invalid_input.includes('kd_prop')}">
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
                                <select class="form-control form-control-sm" v-model="reg.keluarga"
                                    :class="{'is-invalid': invalid_input.includes('keluarga')}">
                                    <option v-for="(kl, index) in keluargas" :key="index" 
                                        :value="kl">
                                        {{ kl }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Nama Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" v-model="reg.namakeluarga"
                                    :class="{'is-invalid': invalid_input.includes('namakeluarga')}">
                            </div>
                            <div class="form-group">
                                <label>Pekerjaan Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" v-model="reg.pekerjaanpj"
                                    :class="{'is-invalid': invalid_input.includes('pekerjaanpj')}">
                            </div>
                            <div class="form-group">
                                <label>Alamat Penanggung Jawab</label>
                                <input type="text" class="form-control form-control-sm" v-model="reg.alamatpj"
                                    :class="{'is-invalid': invalid_input.includes('alamatpj')}">
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Kelurahan</label>
                                        <select class="form-control form-control-sm" v-model="reg.kelurahanpj"
                                            :class="{'is-invalid': invalid_input.includes('kelurahanpj')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.kecamatanpj"
                                            :class="{'is-invalid': invalid_input.includes('kecamatanpj')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.kabupatenpj"
                                            :class="{'is-invalid': invalid_input.includes('kabupatenpj')}">
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
                                        <select class="form-control form-control-sm" v-model="reg.propinsipj"
                                            :class="{'is-invalid': invalid_input.includes('propinsipj')}">
                                            <option v-for="pp in propinsis" :key="pp.kd_prop" 
                                                :value="pp.kd_prop">
                                                {{ pp.nm_prop }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button type="button" class="btn btn-sm btn-primary float-right"
                                    @click="cekValid">Simpan</button>
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
            reg: {
                no_rkm_medis: null,
                nm_pasien: null,
                jk: null,
                gol_darah: null,
                tmp_lahir: null,
                tgl_lahir: null,
                umur: null,
                nm_ibu: null,
                suku_bangsa: null,
                bahasa_pasien: null,
                cacat_fisik: null,
                perusahaan_pasien: null,
                nip: null,
                agama: null,
                stts_nikah: null,
                pnd: null,
                pekerjaan: null,
                tgl_daftar: null,
                no_ktp: null,
                kd_pj: null,
                no_peserta: null,
                no_tlp: null,
                email: null,
                alamat: null,
                kd_kel: null,
                kd_kec: null,
                kd_kab: null,
                kd_prop: null,
                keluarga: null,
                namakeluarga: null,
                pekerjaanpj: null,
                alamatpj: null,
                kelurahanpj: null,
                kecamatanpj: null,
                kabupatenpj: null,
                propinsipj: null
            },
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
            keluargas: [],
            invalid_input: []
        }
    },
    mounted: function () {
        this.setWindowTitle()
        this.defaultTgl()
        this.genNoRm()
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
    computed: {
        umur: function () {
            let umur = {
                th: 0,
                bln: 0,
                hr: 0
            }

            if (this.reg.tgl_lahir) {
                const current = new moment()
                const lahir = new moment(this.reg.tgl_lahir)

                const diff = moment.duration(current.diff(lahir))

                umur = {
                    th: diff._data.years,
                    bln: diff._data.months,
                    hr: diff._data.days
                }
            }

            this.reg.umur = `${umur.th} Th ${umur.bln} Bl ${umur.hr} Hr`

            return umur
        }
    },
    methods: {
        defaultTgl: function () {
            this.reg.tgl_daftar = moment().format('YYYY-MM-DD')
        },
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
        cekValid: function () {
            this.invalid_input = []
            let valid = [true]
            for(let [key, val] of Object.entries(this.reg)) {
                if (!val && key !== 'suku_bangsa'
                    && key !== 'no_peserta'
                    && key !== 'bahasa_pasien'
                    && key !== 'cacat_fisik'
                    && key !== 'perusahaan_pasien'
                    && key !== 'nip'
                    && key !== 'no_tlp') {
                    valid.push(false)
                    this.invalid_input.push(key)
                }
            }

            valid = valid.reduce((final_res, item) => {
                return final_res && item
            })

            if (!valid) {
                const inv = this.invalid_input.map(item => {
                    return item.replace(/_/g, ' ')
                }).join(', ')
                alert(`Harap isi data berikut dengan benar: ${inv}`)
            }
            return valid
        },
        genNoRm: function () {
            const db = new dbUtil()
            let max_no_rm = 0
            db.doQuery(`SELECT 
                    IFNULL(MAX(CONVERT(RIGHT(no_rkm_medis,6),signed)),0) AS maxnorm
                FROM 
                    set_no_rkm_medis`)
                .then(res => {
                    max_no_rm = res[0].maxnorm
                    this.reg.no_rkm_medis = (max_no_rm + 1).toString().padStart(6, '0')
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
        },
        setWindowTitle: function () {
            const name = require('./package.json').name
            remote.getCurrentWindow().setTitle(`${name} | Registrasi Pasien Baru`)
        }
    }

}

export { RegBaru }
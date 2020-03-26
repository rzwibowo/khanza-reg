import { dbUtil } from '../dbconn.js'

import { CariKamarD } from './CariKamarD.js'

const RegInapD = {
    template: `
        <div>
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
                                            <input type="text" class="form-control form-control-sm"
                                                :class="{'is-invalid': invalid_input.includes('noRawat')}"
                                                v-model="noRawat" :readonly="!searchable">
                                            <div class="input-group-append">
                                                <button class="btn btn-sm btn-outline-secondary" 
                                                    type="button" :disabled="!searchable">...</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>No. RM</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="noRm" readonly>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label>Nama</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="nama" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Kamar</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control form-control-sm"
                                                :class="{'is-invalid': invalid_input.includes('kd_kamar')}"
                                                v-model="kd_kamar" @change="cariKamar">
                                            <div class="input-group-append">
                                                <button class="btn btn-sm btn-outline-secondary" type="button"
                                                    @click="dk_visible = !dk_visible">...</button>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>&nbsp;</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="kd_bangsal" readonly>
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <div class="form-group">
                                        <label>&nbsp;</label>
                                        <input type="text" class="form-control form-control-sm" 
                                                :value="nm_bangsal" readonly>
                                    </div>
                                </div>
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label>Status Kamar</label>
                                        <input type="text" class="form-control form-control-sm" 
                                            :value="status" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Tanggal</label>
                                        <input type="date" class="form-control form-control-sm"
                                            v-model="tgl_masuk">
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <div class="form-group">
                                        <label>Jam</label>
                                        <input type="time" step="1" class="form-control form-control-sm"
                                            v-model="jam_masuk">
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
                                        <input type="text" class="form-control form-control-sm"
                                            :class="{'is-invalid': invalid_input.includes('lama')}"
                                            placeholder="Lama inap" v-model="lama" 
                                            @focus="$event.target.select()">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="form-group">
                                        <label>&nbsp;</label>
                                        <div class="input-group input-group-sm">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text">&times;</span>
                                            </div>
                                            <input type="text" class="form-control form-control-sm"
                                                :value="trf_kamar">
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
                                            <input type="text" class="form-control form-control-sm" 
                                                :value="totalBiaya" readonly>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary btn-sm" 
                                data-dismiss="modal" @click="$emit('close')">Tutup</button>
                            <button type="button" class="btn btn-primary btn-sm"
                                @click="saveReg">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
            <CariKamarD v-if="dk_visible" @close="dk_visible = false" 
                @select-k="setKamar"></CariKamarD>
        </div>
    `,
    props: ['noRm', 'nama', 'noRawat', 'searchable'],
    components: {
        CariKamarD
    },
    computed: {
        totalBiaya: function () {
            return this.lama * this.trf_kamar
        }
    },
    data: function () {
        return {
            kd_kamar: null,
            kd_bangsal: '',
            nm_bangsal: '',
            status: '',
            tgl_masuk: null,
            jam_masuk: null,
            diagnosa_awal: '',
            lama: 1,
            trf_kamar: null,
            dk_visible: false,
            invalid_input: []
        }
    },
    mounted: function () {
        this.defaultTgl()
        this.defaultJam()
    },
    methods: {
        defaultTgl: function () {
            this.tgl_masuk = moment().format('YYYY-MM-DD')
        },
        defaultJam: function () {
            this.jam_masuk = moment().format('HH:mm:ss')
        },
        setKamar: function (kamar) {
            this.kd_kamar = kamar.kd_kamar
            this.nm_bangsal = kamar.nm_bangsal
            this.kd_bangsal = kamar.kd_bangsal
            this.trf_kamar = kamar.trf_kamar
            this.status = kamar.status
        },
        getData: function(kodeBed) {
            const db = new dbUtil()
            db.doQuery(`SELECT 
                    bb.kd_kamar, bb.kd_bangsal, aa.nm_bangsal, 
                    bb.trf_kamar, bb.status 
                FROM 
                    bangsal aa
                    JOIN kamar bb ON bb.kd_bangsal = aa.kd_bangsal
                WHERE
                    bb.kd_kamar = '${kodeBed}'
                    AND bb.statusdata = '1'
                ORDER BY 
                    aa.nm_bangsal`)
            .then(res => {
                this.setKamar(res[0])
                return db.closeDb()
            }, err => {
                return db.closeDb().then(() => { throw err })
            })
            .catch(err => console.error(err))
        },
        cariKamar: function () {
            if (this.kd_kamar.length >= 6) {
                this.getData(this.kd_kamar)
            } else if (this.pasien.no_rkm_medis.length === 0) {
                this.setKamar({
                    kd_kamar: null,
                    kd_bangsal: '',
                    nm_bangsal: '',
                    status: '',
                    trf_kamar: null
                })
            }
        },
        cekValid: function () {
            this.invalid_input = []
            let valid = [true]
            
            if (!this.noRawat) {
                valid.push(false)
                this.invalid_input.push('noRawat')
                alert("Pasien tidak boleh kosong")
            } else if (!this.kd_kamar) {
                valid.push(false)
                this.invalid_input.push('kd_kamar')
                alert("Pilih kamar dengan benar")
            } else if (this.status === 'ISI') {
                valid.push(false)
                this.invalid_input.push('kd_kamar')
                alert("Kamar sudah digunakan, pilih kamar lain")
            } else if (!this.lama || this.lama < 1) {
                valid.push(false)
                this.invalid_input.push('lama')
                alert("Isikan lama inap dengan benar")
            }

            valid = valid.reduce((final_res, item) => {
                return final_res && item
            })

            return valid
        },
        saveReg: function() {
            const valid = this.cekValid()
            if (valid) {
                const db = new dbUtil()
                
                db.doQuery(`INSERT INTO
                        kamar_inap
                        (no_rawat, kd_kamar, trf_kamar, diagnosa_awal,
                            diagnosa_akhir, tgl_masuk, jam_masuk,
                            tgl_keluar, jam_keluar, lama, ttl_biaya,
                            stts_pulang)
                    VALUES
                        ('${this.noRawat}', '${this.kd_kamar}', ${this.trf_kamar}, '${this.diagnosa_awal}',
                            '', '${this.tgl_masuk}', '${this.jam_masuk}',
                            '0000-00-00', '00:00:00', ${this.lama}, ${this.totalBiaya},
                            '-')`)
                .then(() => {
                    return db.doQuery(`UPDATE
                            reg_periksa
                        SET
                            status_lanjut = 'Ranap'
                        WHERE
                            no_rawat = '${this.noRawat}'`)
                })
                .then(() => {
                    return db.doQuery(`UPDATE
                            kamar
                        SET
                            status = 'ISI'
                        WHERE
                            kd_kamar = '${this.kd_kamar}'`)
                })
                .then(() => {
                    alert("Berhasil simpan pasien rawat inap")
                    this.kosongkan()
                    this.$emit('close')

                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))
            }
        },
        kosongkan: function () {
            this.kd_kamar = null
            this.kd_bangsal = ''
            this.nm_bangsal = ''
            this.status = ''
            this.diagnosa_awal = null
            this.lama = null
            this.trf_kamar = null

            this.defaultTgl()
            this.defaultJam()
        }
    }
}

export { RegInapD }
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
                                                v-model="noRawat">
                                            <div class="input-group-append">
                                                <button class="btn btn-sm btn-outline-secondary" type="button">...</button>
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
                            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal" @click="$emit('close')">Tutup</button>
                            <button type="button" class="btn btn-primary btn-sm">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>
            <CariKamarD v-show="dk_visible" @close="dk_visible = false" 
                @select-k="setKamar"></CariKamarD>
        </div>
    `,
    props: ['noRm', 'nama', 'noRawat'],
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
            diagnosa_awal: null,
            lama: null,
            trf_kamar: null,
            dk_visible: false
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
        }
    }
}

export { RegInapD }
<template>
  <div class="webrtc-player-container" style="width: 100%; height: 100%; position: relative; overflow: hidden;">
    <video 
      ref="videoRef" 
      autoplay 
      muted 
      playsinline 
      style="width: 100%; height: 100%; object-fit: fill; display: block;"
    ></video>
    <div v-if="loading && !error" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; color: #1890ff; font-size: 14px; background: rgba(0,0,0,0.8); z-index: 5;">
      <i class="el-icon-loading" style="margin-right: 8px;"></i> Đang kết nối luồng...
    </div>
    <div v-if="error && !loading" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ff4d4f; font-size: 12px; background: rgba(0,0,0,0.9); text-align: center; padding: 10px; z-index: 10;">
      <div style="margin-bottom: 10px;">{{ error }}</div>
      <el-button type="primary" size="small" @click="startWebRTC">Thử lại ngay</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebRTCPlayer',
  props: {
    streamName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pc: null,
      error: null,
      loading: false,
      retryCount: 0
    };
  },
  mounted() {
    this.startWebRTC();
  },
  beforeUnmount() {
    this.stopWebRTC();
  },
  methods: {
    stopWebRTC() {
      if (this.pc) {
        this.pc.close();
        this.pc = null;
      }
      if (this.$refs.videoRef) {
        this.$refs.videoRef.srcObject = null;
      }
    },
    async startWebRTC() {
      this.stopWebRTC();
      this.error = null;
      this.loading = true;
      if (!this.retryCount) this.retryCount = 0;
      const videoEl = this.$refs.videoRef;
      if (!videoEl || !this.streamName) return;

      try {
        const hostname = window.location.hostname;
        const whepUrl = `http://${hostname}:8889/${this.streamName}/whep`;
        console.log("Connecting to WebRTC/WHEP:", whepUrl);

        this.pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // ONLY request video since the camera doesn't have audio
        this.pc.addTransceiver('video', { direction: 'recvonly' });

        this.pc.ontrack = (event) => {
          console.log("Received track:", event.track.kind);
          if (event.streams && event.streams[0]) {
            if (videoEl.srcObject !== event.streams[0]) {
              videoEl.srcObject = event.streams[0];
              videoEl.play().catch(e => console.warn("Auto-play failed:", e));
            }
          }
        };

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);

        const res = await fetch(whepUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error: ${res.status} ${errorText}`);
        }

        const answerSdp = await res.text();
        await this.pc.setRemoteDescription({
          type: 'answer',
          sdp: answerSdp,
        });

        console.log(`WebRTC connected! Stream: ${this.streamName}`);
        this.loading = false;
        this.retryCount = 0;
      } catch (err) {
        console.warn(`Connection attempt failed: ${err.message}, retrying...`);
        // Retry up to 100 times (basically forever)
        if (this.retryCount < 100) {
          this.retryCount++;
          setTimeout(() => this.startWebRTC(), 1500);
        } else {
          this.loading = false;
          this.error = `Không thể kết nối luồng sau rất nhiều lần thử. Vui lòng kiểm tra lại MediaMTX.`;
        }
      }
    },
  },
};
</script>


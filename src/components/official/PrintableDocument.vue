<template>
  <div class="printable-document" ref="printableContent">
    <div class="document-header">
      <div class="logo">
        <img src="@/assets/bis-logo.png" alt="Barangay Logo" class="logo-img" />
      </div>
      <div class="header-text">
        <h1>OFFICE OF THE BARANGAY CAPTAIN</h1>
        <h2>BARANGAY {{ barangayName.toUpperCase() }}</h2>
        <p class="barangay-info">{{ barangayAddress }}</p>
        <p class="barangay-info">Contact: {{ barangayContact }}</p>
      </div>
    </div>

    <div class="document-title">
      <h2>{{ getDocumentTypeLabel(documentType).toUpperCase() }}</h2>
    </div>

    <div class="document-body">
      <div class="document-number">
        <p>Document No: <strong>{{ documentNumber }}</strong></p>
        <p>Date Issued: <strong>{{ formatDate(new Date()) }}</strong></p>
      </div>

      <div class="to-whom">
        <p>TO WHOM IT MAY CONCERN:</p>
      </div>

      <div class="content">
        <p class="document-text">
          This is to certify that <strong>{{ name }}</strong>, 
          of legal age, is a bona fide resident of 
          <strong>{{ barangayName }}</strong>, 
          {{ residentAddress }}.
        </p>

        <p class="document-text" v-if="documentType === 'barangay-clearance'">
          This further certifies that <strong>{{ name }}</strong> has no derogatory record 
          filed in this office and is known to be of good moral character.
        </p>

        <p class="document-text" v-if="documentType === 'residency-certificate'">
          This certification is issued upon the request of the above-named person 
          for <strong>{{ purpose }}</strong> purposes.
        </p>

        <p class="document-text" v-if="documentType === 'indigency-certificate'">
          This is to certify further that <strong>{{ name }}</strong> belongs to 
          an indigent family in this barangay and this certification is issued 
          for <strong>{{ purpose }}</strong> purposes.
        </p>

        <p class="document-text" v-if="documentType === 'business-permit'">
          This is to certify that <strong>{{ name }}</strong> is permitted to operate 
          a business named <strong>{{ businessName || '[Business Name]' }}</strong> located at 
          <strong>{{ businessAddress || residentAddress }}</strong> in this barangay.
          This permit is valid until <strong>{{ formatDate(expiryDate) }}</strong>.
        </p>

        <p class="document-text">
          Issued this <strong>{{ currentDay }}</strong> day of <strong>{{ currentMonth }}</strong>, 
          <strong>{{ currentYear }}</strong> at Barangay {{ barangayName }}, 
          {{ barangayAddress }}.
        </p>
      </div>

      <div class="signature-section">
        <div class="signature">
          <div class="signature-line"></div>
          <p class="signatory-name">{{ barangayCaptain }}</p>
          <p class="signatory-title">Barangay Captain</p>
        </div>
        <div class="official-seal">
          <div class="seal-circle">
            <span class="seal-text">OFFICIAL SEAL</span>
          </div>
        </div>
      </div>
    </div>

    <div class="document-footer">
      <p class="footer-text">Not valid without the official seal of Barangay {{ barangayName }}</p>
    </div>

    <div class="print-controls" v-if="!isPrinting">
      <button @click="printDocument" class="print-btn">
        <i class="fas fa-print"></i> Print Document
      </button>
      <button @click="closeDocument" class="close-btn">
        <i class="fas fa-times"></i> Close
      </button>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { ref, computed } from 'vue';

export default {
  props: {
    requestData: {
      type: Object,
      required: true
    },
    barangayInfo: {
      type: Object,
      default: () => ({
        name: 'Sample Barangay',
        address: 'Sample City, Sample Province',
        contact: '0912-345-6789',
        captain: 'Hon. Juan Dela Cruz'
      })
    }
  },
  setup(props, { emit }) {
    const isPrinting = ref(false);
    const printableContent = ref(null);

    // Document details
    const documentType = computed(() => props.requestData.type || props.requestData.documentType);
    const documentNumber = computed(() => props.requestData.id || 'BRGY-' + Math.floor(1000 + Math.random() * 9000));
    const name = computed(() => props.requestData.userName || 'Resident Name');
    const residentAddress = computed(() => props.requestData.address || `${props.barangayInfo.name}, ${props.barangayInfo.address}`);
    const purpose = computed(() => props.requestData.purpose || 'personal');
    const businessName = computed(() => props.requestData.businessName || null);
    const businessAddress = computed(() => props.requestData.businessAddress || null);

    // Dates
    const now = new Date();
    const currentDay = format(now, 'do');
    const currentMonth = format(now, 'MMMM');
    const currentYear = format(now, 'yyyy');
    const expiryDate = computed(() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    });

    // Barangay info
    const barangayName = computed(() => props.barangayInfo.name);
    const barangayAddress = computed(() => props.barangayInfo.address);
    const barangayContact = computed(() => props.barangayInfo.contact);
    const barangayCaptain = computed(() => props.barangayInfo.captain);

    const formatDate = (date) => {
      return format(date, 'MMMM d, yyyy');
    };

    const getDocumentTypeLabel = (typeValue) => {
      const types = {
        'business-permit': 'Business Permit',
        'barangay-clearance': 'Barangay Clearance',
        'barangay-id': 'Barangay ID',
        'residency-certificate': 'Certificate of Residency',
        'indigency-certificate': 'Certificate of Indigency',
        'other': 'Barangay Certification'
      };
      return types[typeValue] || typeValue;
    };

    const printDocument = () => {
      isPrinting.value = true;
      
      setTimeout(() => {
        const printContents = printableContent.value.innerHTML;
        const originalContents = document.body.innerHTML;
        
        document.body.innerHTML = `
          <style>
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-document, .printable-document * {
                visibility: visible;
              }
              .printable-document {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20px;
              }
              .print-controls {
                display: none !important;
              }
              @page {
                size: A4;
                margin: 20mm;
              }
            }
          </style>
          ${printContents}
        `;
        
        window.print();
        document.body.innerHTML = originalContents;
        isPrinting.value = false;
      }, 100);
    };

    const closeDocument = () => {
      emit('close');
    };

    return {
      isPrinting,
      printableContent,
      documentType,
      documentNumber,
      name,
      residentAddress,
      purpose,
      businessName,
      businessAddress,
      currentDay,
      currentMonth,
      currentYear,
      expiryDate,
      barangayName,
      barangayAddress,
      barangayContact,
      barangayCaptain,
      formatDate,
      getDocumentTypeLabel,
      printDocument,
      closeDocument
    };
  }
};
</script>

<style scoped>
.printable-document {
  max-width: 800px;
  margin: 0 auto;
  padding: 2.5rem;
  background: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  font-family: 'Times New Roman', Times, serif;
  line-height: 1.6;
  color: #333;
  border: 1px solid #e0e0e0;
}

.document-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #1a3e72;
}

.logo {
  flex: 0 0 auto;
}

.logo-img {
  height: 100px;
  width: auto;
  margin-right: 2rem;
  object-fit: contain;
}

.header-text {
  flex: 1;
  text-align: center;
}

.header-text h1 {
  font-size: 1.3rem;
  margin: 0;
  font-weight: bold;
  color: #1a3e72;
  letter-spacing: 1px;
}

.header-text h2 {
  font-size: 1.6rem;
  margin: 0.5rem 0;
  font-weight: bold;
  color: #1a3e72;
}

.barangay-info {
  margin: 0.3rem 0;
  font-size: 0.95rem;
  color: #555;
}

.document-title {
  text-align: center;
  margin-bottom: 2.5rem;
}

.document-title h2 {
  font-size: 1.6rem;
  margin: 0;
  text-decoration: underline;
  font-weight: bold;
  color: #1a3e72;
  letter-spacing: 1px;
}

.document-number {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
  font-size: 0.95rem;
  color: #555;
}

.to-whom {
  margin-bottom: 1.8rem;
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.content {
  text-align: justify;
  margin-bottom: 3.5rem;
  text-indent: 50px;
  font-size: 1.05rem;
}

.document-text {
  margin-bottom: 1.2rem;
  line-height: 1.8;
}

.signature-section {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 4rem;
  position: relative;
}

.signature {
  text-align: right;
  margin-right: 2rem;
}

.signature-line {
  border-top: 1px solid #333;
  margin-bottom: 0.5rem;
  width: 250px;
}

.signatory-name {
  font-weight: bold;
  margin-bottom: 0;
  font-size: 1.1rem;
}

.signatory-title {
  margin-top: 0;
  font-size: 0.95rem;
  color: #555;
}

.official-seal {
  position: absolute;
  right: 0;
  top: -30px;
}

.seal-circle {
  width: 120px;
  height: 120px;
  border: 3px solid #1a3e72;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #1a3e72;
  transform: rotate(-15deg);
  background-color: rgba(255, 255, 255, 0.8);
}

.seal-text {
  padding: 10px;
  text-align: center;
  line-height: 1.3;
}

.document-footer {
  margin-top: 3.5rem;
  font-style: italic;
  text-align: center;
  font-size: 0.9rem;
  color: #777;
  border-top: 1px solid #e0e0e0;
  padding-top: 1rem;
}

.footer-text {
  margin: 0;
}

.print-controls {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.print-btn, .close-btn {
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.print-btn {
  background-color: #1a3e72;
  color: white;
}

.print-btn:hover {
  background-color: #14315d;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background-color: #6c757d;
  color: white;
}

.close-btn:hover {
  background-color: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

@media print {
  .printable-document {
    border: none;
    box-shadow: none;
    padding: 0;
  }
  
  .print-controls {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .printable-document {
    padding: 1.5rem;
  }
  
  .document-header {
    flex-direction: column;
    text-align: center;
  }
  
  .logo-img {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .signature-section {
    flex-direction: column;
    align-items: flex-end;
  }
  
  .official-seal {
    position: relative;
    right: auto;
    top: auto;
    margin-top: 1rem;
    margin-bottom: 1rem;
    align-self: center;
  }
}
</style>
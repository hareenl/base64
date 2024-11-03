// Select necessary HTML elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const encodeTextBtn = document.getElementById('encode-text-btn');
const decodeTextBtn = document.getElementById('decode-text-btn');
const fileInput = document.getElementById('file-input');
const encodeFileBtn = document.getElementById('encode-file-btn');
const decodeFileBtn = document.getElementById('decode-file-btn');
const downloadLink = document.getElementById('download-link');

// Base64 Encode text
encodeTextBtn.addEventListener('click', () => {
  try {
    const encodedText = btoa(inputText.value);  // Encode input text to Base64
    outputText.value = encodedText;  // Display encoded text
  } catch (error) {
    alert('Error encoding text. Make sure it is valid.');
  }
});

// Base64 Decode text
decodeTextBtn.addEventListener('click', () => {
  try {
    const decodedText = atob(inputText.value);  // Decode input text from Base64
    outputText.value = decodedText;  // Display decoded text
  } catch (error) {
    alert('Invalid Base64 string.');
  }
});

// Base64 Encode file
encodeFileBtn.addEventListener('click', () => {
  const file = fileInput.files[0];  // Get the first selected file
  if (file) {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Convert the file data from byte array to Base64
      const base64String = btoa(String.fromCharCode(...new Uint8Array(reader.result)));
      
      outputText.value = base64String;  // Show the encoded string in the output
      createDownloadLink(base64String, `${file.name}.b64`, 'text/plain'); // Create .b64 file download link
    };
    
    reader.readAsArrayBuffer(file);
  } else {
    alert('Please select a file to encode.');
  }
});

// Base64 Decode file
decodeFileBtn.addEventListener('click', () => {
  const base64String = inputText.value;  // Get the Base64 input from user
  
  try {
    const binaryString = atob(base64String);  // Decode Base64 string
    
    // Convert the binary string to a byte array
    const byteArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
    
    // Create a binary Blob (generic file type)
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    
    // Trigger download of decoded file
    createDownloadLink(blob, 'decoded_file');
  } catch (error) {
    alert('Invalid Base64 string or decoding error.');
  }
});

// Helper function to create downloadable Blob URLs
function createDownloadLink(data, filename, mimeType='application/octet-stream') {
  const blob = typeof data === 'string'
    ? new Blob([data], { type: mimeType })
    : data;
    
  const url = URL.createObjectURL(blob);   // Create a Blob URL for file
  downloadLink.href = url;  // Assign URL to download link
  downloadLink.download = filename;  // Assign filename for download
  
  // Make the download link visible and clickable
  downloadLink.textContent = `Download ${filename}`;
  downloadLink.style.display = 'block';
  
  // Auto-click the download link to trigger download
  downloadLink.click();

  // Optionally, release the Blob URL after the download
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

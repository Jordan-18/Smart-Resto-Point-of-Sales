export const formFormat = (el) => {
    const formData = new FormData(document.getElementById(el));
    let jsonData = {};

    for (let [key, value] of formData.entries()) {
        if (key.includes('[]')) {
            const fieldName = key.replace('[]', '');

            if (!jsonData[fieldName]) {
                jsonData[fieldName] = [];
            }

            if (value instanceof File) {
                jsonData[fieldName].push(value);
            } else {
                try {
                    const parsedValue = JSON.parse(value);
                    jsonData[fieldName].push(parsedValue);
                } catch (error) {
                    jsonData[fieldName].push(value);
                }
            }
        } else {
            jsonData[key] = value;
        }
    }

    return jsonData;
}

// export const formFormat = (el) => {
//     const formData = new FormData(document.getElementById(el));
//     let jsonData = {};
//     for (let [key, value] of formData.entries()) {
//         jsonData[key] = value;
//     }

//     return jsonData
// }

// export const formFormat = (el) => {
//     const formElement = document.getElementById(el);
//     const formData = new FormData(formElement);
//     let jsonData = {};
  
//     for (let [key, value] of formData.entries()) {
//       if (key.includes('[]')) {
//         const fieldName = key.replace('[]', '');
  
//         if (!jsonData[fieldName]) {
//           jsonData[fieldName] = [];
//         }
  
//         if (formElement[key].type === 'file') {
//           // Handle file uploads differently
//           jsonData[fieldName].push(formElement[key].files[0]);
//         } else {
//           try {
//             const parsedValue = JSON.parse(value);
//             jsonData[fieldName].push(parsedValue);
//           } catch (error) {
//             jsonData[fieldName].push(value);
//           }
//         }
//       } else {
//         jsonData[key] = value;
//       }
//     }
  
//     return jsonData;
// };
  
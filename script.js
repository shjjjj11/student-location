// script.js

const students = ["2101강보송", "2102김규원", "2103김다빈", "2104김동주", "2105김민재", "2106김유경", "2107민수현", "2108박정효", 
    "2109변세희", "2110성지민", "2111송하민", "2112심현서", "2113양서진", "2114유이정", "2115유혜린", 
    "2116이가영", "2117이예슬", "2118이의진", "2119임세윤", "2120정서현", "2121정해서", "2122최근영", 
    "2123서형진", "2124연진모"];

const locations = ["교실(이동x)", "외출", "국탐실", "국악실", "무용실", "체육관", "방송실", "음악실", "랭블", "글블 1", "글블 2", "글블 3", "글숲마루", "미술실", "렉처룸", "스터디홀", "홈베이스", "시청각실", "진로교육실", "학생회실", "위클래스", "수교과실"];

function createSelect(selectedValue = "") {
    const select = document.createElement("select");
    locations.forEach(location => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        if (location === selectedValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });
    return select;
}

function populateTable() {
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    students.forEach(student => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = student;
        row.appendChild(nameCell);

        for (let i = 0; i < 3; i++) {
            const cell = document.createElement("td");
            const savedValue = getSavedChoice(student, i);
            cell.appendChild(createSelect(savedValue));
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    });
}

function getSavedChoice(student, period) {
    const savedData = JSON.parse(localStorage.getItem("studentChoices")) || {};
    return savedData[student] ? savedData[student][period] : "";
}

function saveChoices(choices) {
    localStorage.setItem("studentChoices", JSON.stringify(choices));
}

function submitChoices() {
    const rows = document.querySelectorAll("#studentTable tbody tr");
    const choices = {};

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const studentName = cells[0].textContent;
        choices[studentName] = [];

        for (let i = 1; i < cells.length; i++) {
            const select = cells[i].querySelector("select");
            choices[studentName].push(select.value);
        }
    });

    saveChoices(choices);
    alert("선택한 내용이 저장되었습니다.");
    visualizeChoices();
}

function visualizeChoices() {
    const savedData = JSON.parse(localStorage.getItem("studentChoices")) || {};
    const periods = ["8/9교시", "야자 1텀", "야자 2텀"];
    const locationCounts = {};

    locations.forEach(location => {
        locationCounts[location] = [0, 0, 0];
    });

    Object.values(savedData).forEach(studentChoices => {
        studentChoices.forEach((choice, periodIndex) => {
            locationCounts[choice][periodIndex]++;
        });
    });

    const data = {
        labels: periods,
        datasets: locations.map(location => ({
            label: location,
            data: locationCounts[location],
            backgroundColor: getRandomColor(),
        }))
    };

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                }
            }
        }
    });
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

document.addEventListener("DOMContentLoaded", () => {
    populateTable();
    visualizeChoices();
});

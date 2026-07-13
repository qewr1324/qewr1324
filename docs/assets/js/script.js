(function () {
	const progressCircle = document.getElementById("progressCircle");
	const percentDisplay = document.getElementById("percentDisplay");
	const skillList = document.getElementById("skillList");
	const projectList = document.getElementById("projectList");
	const tooltip = document.getElementById("skillTooltip");
	const tooltipSkillName = document.getElementById("tooltipSkillName");
	const tooltipItems = document.getElementById("tooltipItems");
	const circumference = 2 * Math.PI * 100;

	let rafId = null;

	function setProgress(percent) {
		const offset = circumference - (percent / 100) * circumference;
		progressCircle.style.strokeDashoffset = offset;
		percentDisplay.textContent = percent + "٪";
	}

	async function loadJSON(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			return await response.json();
		} catch (error) {
			console.error(`❌ خطا در بارگذاری ${url}:`, error);
			return null;
		}
	}

	function renderSkills(skillsData) {
		if (!skillsData || !skillsData.skills) {
			skillList.innerHTML = '<div style="color:#94a3b8;padding:1rem;grid-column:1/-1;text-align:center;">مهارتی یافت نشد</div>';
			return;
		}

		skillList.innerHTML = "";
		skillsData.skills.forEach((skill) => {
			const item = document.createElement("div");
			item.className = "skill-item";
			item.setAttribute("data-percent", skill.percent);
			item.setAttribute("data-skill-name", skill.name);
			item.setAttribute("data-titles", JSON.stringify(skill.titles || []));

			const iconSpan = document.createElement("span");
			iconSpan.className = "skill-icon";
			iconSpan.innerHTML = `<i class="fab ${skill.icon}"></i>`;

			const nameSpan = document.createElement("span");
			nameSpan.className = "skill-name";
			nameSpan.textContent = skill.name;

			const percentSpan = document.createElement("span");
			percentSpan.className = "skill-percent";
			percentSpan.textContent = skill.percent + "٪";

			item.appendChild(iconSpan);
			item.appendChild(nameSpan);
			item.appendChild(percentSpan);

			let lastEvent = null;

			item.addEventListener("mouseenter", function (e) {
				const p = parseInt(this.getAttribute("data-percent"), 10);
				if (!isNaN(p)) setProgress(p);

				const skillName = this.getAttribute("data-skill-name");
				const titles = JSON.parse(this.getAttribute("data-titles") || "[]");
				showTooltip(e, skillName, titles);
				lastEvent = e;
			});

			item.addEventListener("mousemove", function (e) {
				lastEvent = e;
				if (rafId) return;

				rafId = requestAnimationFrame(() => {
					if (lastEvent) {
						updateTooltipPosition(lastEvent);
					}
					rafId = null;
				});
			});

			item.addEventListener("mouseleave", function () {
				if (rafId) {
					cancelAnimationFrame(rafId);
					rafId = null;
				}
				setProgress(0);
				hideTooltip();
				lastEvent = null;
			});

			skillList.appendChild(item);
		});
	}

	function renderProjects(projectsData) {
		if (!projectsData || !projectsData.projects) {
			projectList.innerHTML = '<div style="color:#94a3b8;padding:0.5rem;width:100%;text-align:center;">اطلاعاتی یافت نشد</div>';
			return;
		}

		projectList.innerHTML = "";
		projectsData.projects.forEach((proj) => {
			const block = document.createElement("div");
			block.className = "extra-block";
			block.innerHTML = `
              <i class="fas ${proj.icon}"></i>
              <span>${proj.label}</span>
              <span class="highlight">${proj.value}</span>
            `;
			projectList.appendChild(block);
		});
	}

	function showTooltip(event, skillName, titles) {
		tooltipSkillName.textContent = skillName;
		tooltipItems.innerHTML = "";

		if (titles && titles.length > 0) {
			titles.forEach((title, index) => {
				const span = document.createElement("span");
				span.className = "tooltip-item";
				if (index === 0) span.classList.add("highlight");
				span.textContent = title;
				tooltipItems.appendChild(span);
			});
		} else {
			const span = document.createElement("span");
			span.className = "tooltip-item";
			span.textContent = "— موردی ثبت نشده —";
			tooltipItems.appendChild(span);
		}

		tooltip.classList.add("visible");
		updateTooltipPosition(event);
	}

	function updateTooltipPosition(event) {
		const tooltipRect = tooltip.getBoundingClientRect();
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		let left = event.clientX - tooltipRect.width - 15;
		let top = event.clientY + 15;

		if (left < 10) {
			left = event.clientX + 15;
		}

		if (left + tooltipRect.width > windowWidth - 10) {
			left = event.clientX - tooltipRect.width - 15;
		}

		if (top + tooltipRect.height > windowHeight - 10) {
			top = event.clientY - tooltipRect.height - 15;
		}

		if (top < 10) {
			top = event.clientY + 15;
		}

		tooltip.style.left = left + "px";
		tooltip.style.top = top + "px";
	}

	function hideTooltip() {
		tooltip.classList.remove("visible");
	}

	async function init() {
		const [skillsData, projectsData] = await Promise.all([loadJSON("skills.json"), loadJSON("projects.json")]);

		renderSkills(skillsData);
		renderProjects(projectsData);
		setProgress(0);
	}

	init();
})();

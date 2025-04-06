class TuneDataProcessor {
    constructor(tuneData) {
        this.tuneData = tuneData;
        this.cumulativeCounts = {};
    }

    processTuneData() {
        this.tuneData.forEach(entry => {
            const date = new Date(entry.Date);
            const tune = entry.Tune;

            if (!this.cumulativeCounts[tune]) {
                this.cumulativeCounts[tune] = { count: 0, dates: [] };
            }

            this.cumulativeCounts[tune].count += 1;
            this.cumulativeCounts[tune].dates.push(date);
        });

        this.calculateCumulativeCounts();
    }

    calculateCumulativeCounts() {
        const cumulativeData = {};

        Object.keys(this.cumulativeCounts).forEach(tune => {
            cumulativeData[tune] = [];
            let cumulativeCount = 0;

            this.cumulativeCounts[tune].dates.forEach(date => {
                cumulativeCount += this.cumulativeCounts[tune].count;
                cumulativeData[tune].push({ date: date.toISOString().split('T')[0], count: cumulativeCount });
            });
        });

        return cumulativeData;
    }
}

export default TuneDataProcessor;
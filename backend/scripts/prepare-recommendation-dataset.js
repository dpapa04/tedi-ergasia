const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const archive = process.argv[2] || path.resolve(__dirname, '../../dataset.zip');
const output = process.argv[3] || path.resolve('/tmp/recommendation-interactions.jsonl');

if (!fs.existsSync(archive)) {
  console.error(`Dataset archive not found: ${archive}`);
  process.exit(1);
}

const writeStream = fs.createWriteStream(output, { encoding: 'utf8' });
let rows = 0;

const streamCsvFromZip = (entry) => {
  const unzip = spawn('unzip', ['-p', archive, entry], { stdio: ['ignore', 'pipe', 'inherit'] });
  unzip.on('error', (error) => {
    console.error(`Unable to read ${entry}: ${error.message}`);
    process.exitCode = 1;
  });
  return readline.createInterface({ input: unzip.stdout, crlfDelay: Infinity });
};

const parseInterest = async () => {
  const lines = streamCsvFromZip('rel_event_csvs/event_interest.csv');
  let header = true;
  for await (const line of lines) {
    if (header) {
      header = false;
      continue;
    }
    const [user, event, invited, timestamp, interested, notInterested] = line.split(',');
    const rating = interested === '1' ? 3 : notInterested === '1' ? 0 : invited === '1' ? 1 : null;
    if (rating === null) continue;
    writeStream.write(`${JSON.stringify({ userId: user, eventId: event, rating, source: 'interest', timestamp })}\n`);
    rows += 1;
  }
};

const parseAttendees = async () => {
  const lines = streamCsvFromZip('rel_event_csvs/event_attendees.csv');
  let header = true;
  for await (const line of lines) {
    if (header) {
      header = false;
      continue;
    }
    const columns = line.split(',');
    const event = columns[1];
    const status = columns[2];
    const user = columns[3];
    const timestamp = columns[4];
    if (status !== 'yes' || !user) continue;
    writeStream.write(`${JSON.stringify({ userId: user, eventId: event, rating: 5, source: 'attendance', timestamp })}\n`);
    rows += 1;
  }
};

(async () => {
  await parseInterest();
  await parseAttendees();
  writeStream.end(() => console.log(`Wrote ${rows} interactions to ${output}`));
})().catch((error) => {
  writeStream.destroy();
  console.error(error);
  process.exitCode = 1;
});
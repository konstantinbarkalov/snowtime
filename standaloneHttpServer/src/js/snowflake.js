'use strict';
const delayMetas = [ // TODO link with same in delayer.js
  {
    beat: 0.25 / 2,
  },
  {
    beat: 0.25 * 1,
  },
  {
    beat: 0.25 * 2,
  },
  {
    beat: 0.25 * 3,
  },
  {
    beat: 0.25 * 4,
  },
  {
    beat: 0.25 * 6,
  },
  {
    beat: 0.25 * 8,
  }
]

function Snowflake(index, positions, seeds, velocities, ttlRatios, beatHashedRgbsIndexes, glVelocities, streakPowerRatios) {
  let that = this;
  const medianLifetimeBeat = 4;
  let lifetimeBeat = 0;
  // dunno what to do: put it into typed array as all other stuff,
  // or leave it as variable due less frequendly change (once per rebirh)
  function init() {
    fillSeed();
    rebirth();
  }
  function fillSeed() {
    seeds[index * 3 + 0] = Math.random();
    seeds[index * 3 + 1] = Math.random();
    seeds[index * 3 + 2] = Math.random();
  }
  function rebirth() {
    lifetimeBeat = Math.random() * 2 * medianLifetimeBeat;
    let ttlRatio = 1;
    let beatHashedRgbsIndex = Math.floor(Math.random()*3);
    let posX = Math.random() - 0.5;
    let posY = Math.random() - 0.5;
    posX *= teplite.aspectRatio;
    let camShiftZ = 5;
    let nearestZ = camShiftZ * Math.pow(teplite.videoQualityRatio, 0.5);
    let farestZ = -10 * Math.pow(teplite.videoQualityRatio, 2);
    let posZ = nearestZ - Math.random() * (nearestZ - farestZ);
    let frustrumMultiplier = ((posZ - camShiftZ) / camShiftZ);
    posX *= frustrumMultiplier;
    posY *= frustrumMultiplier;
    let velX = (Math.random() - 0.5) * 0.1;
    let velY = (Math.random() - 0.5) * 0.1;
    let velZ = (Math.random() - 0.5) * 0.5;

    let glVelocityX = 0;
    let glVelocityY = 0;
    let glVelocityZ = 0;

    let streakPowerRatio = 0;

    ttlRatios[index] = ttlRatio;
    beatHashedRgbsIndexes[index] = beatHashedRgbsIndex;

    positions[index * 3 + 0] = posX;
    positions[index * 3 + 1] = posY;
    positions[index * 3 + 2] = posZ;

    velocities[index * 3 + 0] = velX;
    velocities[index * 3 + 1] = velY;
    velocities[index * 3 + 2] = velZ;

    glVelocities[index * 3 + 0] = glVelocityX;
    glVelocities[index * 3 + 1] = glVelocityY;
    glVelocities[index * 3 + 2] = glVelocityZ;

    streakPowerRatios[index] = streakPowerRatio;
  }
  that.live = function(beatNum, beatNumDiff, beatHashedRgbs, hazeBratios) {
    let ttlRatio = ttlRatios[index];
    ttlRatio -= beatNumDiff/lifetimeBeat;
    if (ttlRatio < 0) {
      rebirth();
    } else {
      let circlizeBratio = hazeBratios[0];
      let circlizeRatio = Math.abs(circlizeBratio);
      let posX = positions[index * 3 + 0];
      let posY = positions[index * 3 + 1];
      let posZ = positions[index * 3 + 2];

      let velX = velocities[index * 3 + 0];
      let velY = velocities[index * 3 + 1];
      let velZ = velocities[index * 3 + 2];

      let accX = Math.sin(Math.PI * beatNum / 4 + posX * 10 ) * hazeBratios[0] * 2 * circlizeRatio * circlizeRatio * circlizeRatio;
      let accY = Math.cos(Math.PI * beatNum / 4 + posY * 10 ) * hazeBratios[0] * 2 * circlizeRatio * circlizeRatio * circlizeRatio;
      let accZ = 0;

      let gravityBratios = [0, -1, 0];
      accX += gravityBratios[0] / 20;
      accY += gravityBratios[1] / 20;
      accZ += gravityBratios[2] / 20;

      let velAngle = Math.atan2(velX, velY);
      let velMag = Math.sqrt(velX * velX + velY * velY);
      velAngle += Math.PI * beatNumDiff * 3 * -circlizeBratio;
      velX = Math.sin(velAngle) * velMag * 0.95 + velX * 0.05;
      velY = Math.cos(velAngle) * velMag * 0.95 + velY * 0.05;

      let xySpdFactor = 1 - Math.abs(hazeBratios[1]);
      let delayRatio = (teplite.devunoBratios[0] + 1) / 2;
      let delayIndex = Math.round(delayRatio * (delayMetas.length - 1));
      let zSpdFactor = 1 + 5 * Math.pow(hazeBratios[0], 4) * Math.sin(beatNum / delayMetas[delayIndex].beat * Math.PI * 2) / Math.pow(delayMetas[delayIndex].beat, 0.5);

      velX = velX + accX * beatNumDiff;
      velY = velY + accY * beatNumDiff;
      velZ = velZ + accZ * beatNumDiff;
      let actualVelX = velX * xySpdFactor;
      let actualVelY = velY * xySpdFactor;
      let actualVelZ = velZ * zSpdFactor;
      posX = posX + actualVelX * beatNumDiff;
      posY = posY + actualVelY * beatNumDiff;
      posZ = posZ + actualVelZ * beatNumDiff;

      positions[index * 3 + 0] = posX;
      positions[index * 3 + 1] = posY;
      positions[index * 3 + 2] = posZ;

      velocities[index * 3 + 0] = velX;
      velocities[index * 3 + 1] = velY;
      velocities[index * 3 + 2] = velZ;

      glVelocities[index * 3 + 0] = actualVelX;
      glVelocities[index * 3 + 1] = actualVelY;
      glVelocities[index * 3 + 2] = actualVelZ;

      ttlRatios[index] = ttlRatio;
    }
  }
  init();
}
module.exports = Snowflake;
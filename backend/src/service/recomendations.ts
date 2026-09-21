import { AppDataSource } from "../config/data";
import { Booking } from "../entities/bookings";
import { Event, EventStatus } from "../entities/events";

interface Interaction {
  userId: string;
  eventId: string;
  rating: number; // 1.0 for view, 5.0 for booking
}

export class BiasedMatrixFactorization {
  private K: number;
  private eta: number;
  private lambda: number;
  private epochs: number;

  private mu: number = 0;
  private userBiases: Map<string, number> = new Map();
  private itemBiases: Map<string, number> = new Map();
  private userFactors: Map<string, number[]> = new Map();
  private itemFactors: Map<string, number[]> = new Map();

  constructor(K = 10, eta = 0.005, lambda = 0.02, epochs = 20) {
    this.K = K;
    this.eta = eta;
    this.lambda = lambda;
    this.epochs = epochs;
  }

  private initVector(dim: number): number[] {
    return Array.from({ length: dim }, () => (Math.random() - 0.5) * 0.1);
  }

  public train(data: Interaction[], userIds: string[], itemIds: string[]) {
    if (data.length === 0) return;

    // Calculate global mean
    const totalRating = data.reduce((acc, d) => acc + d.rating, 0);
    this.mu = totalRating / data.length;

    // Initialize parameters
    userIds.forEach((u) => {
      this.userBiases.set(u, 0);
      this.userFactors.set(u, this.initVector(this.K));
    });
    itemIds.forEach((i) => {
      this.itemBiases.set(i, 0);
      this.itemFactors.set(i, this.initVector(this.K));
    });

    // Stochastic Gradient Descent (SGD)
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      for (const { userId, eventId, rating } of data) {
        const bu = this.userBiases.get(userId) || 0;
        const bi = this.itemBiases.get(eventId) || 0;
        const pu = this.userFactors.get(userId) || this.initVector(this.K);
        const qi = this.itemFactors.get(eventId) || this.initVector(this.K);

        // Dot product
        const dot = pu.reduce((sum, p_k, k) => sum + p_k * qi[k], 0);
        const pred = this.mu + bu + bi + dot;
        const err = rating - pred;

        // Update biases
        this.userBiases.set(userId, bu + this.eta * (err - this.lambda * bu));
        this.itemBiases.set(eventId, bi + this.eta * (err - this.lambda * bi));

        // Update latent factors
        for (let k = 0; k < this.K; k++) {
          const puOld = pu[k];
          pu[k] += this.eta * (err * qi[k] - this.lambda * pu[k]);
          qi[k] += this.eta * (err * puOld - this.lambda * qi[k]);
        }
        this.userFactors.set(userId, pu);
        this.itemFactors.set(eventId, qi);
      }
    }
  }

  public predict(userId: string, eventId: string): number {
    const bu = this.userBiases.get(userId) || 0;
    const bi = this.itemBiases.get(eventId) || 0;
    const pu = this.userFactors.get(userId);
    const qi = this.itemFactors.get(eventId);

    if (!pu || !qi) return this.mu + bu + bi;

    const dot = pu.reduce((sum, p_k, k) => sum + p_k * qi[k], 0);
    return this.mu + bu + bi + dot;
  }
}
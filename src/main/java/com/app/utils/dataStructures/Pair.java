package com.app.utils.dataStructures;

/**
 * Created by Andrea on 07/03/2017.
 *
 * @param <L> the type parameter
 * @param <R> the type parameter
 */
public class Pair<L, R> {
    private L l;
    private R r;

    /**
     * Instantiates a new Pair.
     *
     * @param l the l
     * @param r the r
     */
    public Pair(L l, R r) {
        this.l = l;
        this.r = r;
    }

    /**
     * Gets l.
     *
     * @return the l
     */
    public L getL() {
        return l;
    }

    /**
     * Gets r.
     *
     * @return the r
     */
    public R getR() {
        return r;
    }

    /**
     * Sets l.
     *
     * @param l the l
     */
    public void setL(L l) {
        this.l = l;
    }

    /**
     * Sets r.
     *
     * @param r the r
     */
    public void setR(R r) {
        this.r = r;
    }
}

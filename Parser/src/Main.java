/**
 * Created by Andrea on 08/03/2017.
 */
public class Main {

    public static void main(String argv[]) throws Exception {
        Parser parser = new Parser("/Users/Andrea/Desktop/Parser/large_lugano.xml");
        parser.createCity();
        parser.printCity();

    }
}
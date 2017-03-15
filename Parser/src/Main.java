/**
 * Created by Andrea on 08/03/2017.
 */
public class Main {

    public static void main(String argv[]) throws Exception {

        String s = "foo";
        byte[] bytes = s.getBytes();
        System.out.println(s.);

        StringBuilder binary = new StringBuilder();
        for (byte b : bytes)
        {
            int val = b;
            for (int i = 0; i < 8; i++)
            {
                binary.append((val & 128) == 0 ? 0 : 1);
                val <<= 1;
            }
            binary.append(' ');
        }
        System.out.println("'" + s + "' to binary: " + binary);


//        Parser parser = new Parser("/Users/Andrea/Desktop/Parser/large_lugano.xml");
//        parser.createCity();
//        parser.printCity();

//        DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
//        DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
//
//        // root elements
//        Document doc = docBuilder.newDocument();
//        Element rootElement = doc.createElement("Points");
//        doc.appendChild(rootElement);
//
//        // staff elements
//        Element point = doc.createElement("Point");
//        point.setAttribute("Longitude", "1");
//        point.setAttribute("Latitude", "1");
//        rootElement.appendChild(point);
//
//        Element point1 = doc.createElement("Point");
//        point1.setAttribute("Longitude", "2");
//        point1.setAttribute("Latitude", "3");
//        rootElement.appendChild(point1);
//
//        TransformerFactory tf = TransformerFactory.newInstance();
//        Transformer transformer = tf.newTransformer();
//        transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
//        StringWriter writer = new StringWriter();
//        transformer.transform(new DOMSource(doc), new StreamResult(writer));
//        String output = writer.getBuffer().toString().replaceAll("\n|\r", "");
//        System.out.println(output);
//
//
//        String pointsString = "Ciaone";
//
//        pointsString = pointsString.substring(0, pointsString.length() - 1);
//        System.out.println(pointsString);

    }

}
